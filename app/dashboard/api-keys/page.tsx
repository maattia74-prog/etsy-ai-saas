'use client';

import { Key, Plus, Copy, Trash2 } from 'lucide-react';

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">API Keys</h1><p className="text-gray-500 mt-1">Manage API keys for programmatic access</p></div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New API Key</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="API key name (e.g., Production Server)" className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none" />
          <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><Plus className="h-4 w-4" /> Create</button>
        </div>
      </div>
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left font-medium text-gray-500">Name</th><th className="px-6 py-3 text-left font-medium text-gray-500">Key</th><th className="px-6 py-3 text-left font-medium text-gray-500">Created</th><th className="px-6 py-3 text-left font-medium text-gray-500">Actions</th></tr></thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4"><div className="flex items-center gap-2"><Key className="h-4 w-4 text-gray-400" /><span className="font-medium">Production</span></div></td><td className="px-6 py-4"><code className="text-xs bg-gray-100 px-2 py-1 rounded">sk_live_abc1...</code></td><td className="px-6 py-4">Mar 15, 2026</td><td className="px-6 py-4"><div className="flex gap-2"><button className="text-gray-400 hover:text-gray-600"><Copy className="h-4 w-4" /></button><button className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}