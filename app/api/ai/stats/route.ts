// app/api/ai/stats/route.ts

import { NextResponse } from 'next/server';
import { AIStats } from '@/types';

// Sample data for AI stats, can be fetched from a database if needed.
const aiStats: AIStats[] = [
    { id: 1, name: 'Model A', usage: 100 },
    { id: 2, name: 'Model B', usage: 150 },
    { id: 3, name: 'Model C', usage: 90 },
];

// Function to calculate total usage
const calculateTotalUsage = (stats: AIStats[]): number => {
    return stats.reduce((total: number, stat: AIStats) => total + stat.usage, 0);
};

// Function to handle GET requests
export async function GET() {
    const totalUsage = calculateTotalUsage(aiStats);
    return NextResponse.json({ totalUsage, aiStats });
}