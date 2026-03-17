import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash, randomBytes } from 'crypto';

if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_ENDPOINT) {
  throw new Error('R2 credentials not configured');
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export interface UploadOptions {
  bucket: string;
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  etag: string;
}

export class R2Storage {
  async upload(options: UploadOptions): Promise<UploadResult> {
    const { bucket, key, body, contentType, metadata } = options;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
        sha256: createHash('sha256').update(body).digest('hex'),
      },
    });

    const result = await r2Client.send(command);

    return {
      key,
      url: `https://${bucket}.${process.env.R2_ENDPOINT?.split('//')[1]}/${key}`,
      etag: result.ETag || '',
    };
  }

  async download(bucket: string, key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await r2Client.send(command);
    const body = await result.Body?.transformToByteArray();
    
    if (!body) {
      throw new Error('Failed to download file');
    }

    return Buffer.from(body);
  }

  async delete(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await r2Client.send(command);
  }

  async list(bucket: string, prefix: string, maxKeys: number = 100): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    const result = await r2Client.send(command);
    return (result.Contents || []).map((obj) => obj.Key!);
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(r2Client, command, { expiresIn });
  }

  generateKey(prefix: string, filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || 'bin';
    const hash = randomBytes(12).toString('hex');
    const timestamp = Date.now();
    return `${prefix}/${timestamp}-${hash}.${ext}`;
  }
}

export const r2Storage = new R2Storage();
