'use client';

import { useState } from 'react';
import { Search, Loader2, TrendingUp } from 'lucide-react';

export default function KeywordsPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Keyword Research</h1>
        <p className="text-gray-500 mt-1">Discover high-opportunity keywords with AI</p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Keyword Analysis</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Enter keyword to analyze..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none" />
          <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            <Search className="h-4 w-4" /> Analyze
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Search Volume</p><p className="text-3xl font-bold mt-2">12,400</p><p className="text-xs text-gray-500 mt-1">monthly searches</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Competition</p><span className="inline-block mt-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Low</span><div className="w-full bg-gray-200 rounded-full h-2 mt-3"><div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div></div></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Opportunity Score</p><p className="text-3xl font-bold mt-2">85/100</p><div className="w-full bg-gray-200 rounded-full h-2 mt-3"><div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div></div></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Trend</p><div className="flex items-center gap-2 mt-2"><TrendingUp className="h-8 w-8 text-green-500" /><span className="text-2xl font-bold">Up</span></div></div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Keyword</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Volume</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Competition</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Difficulty</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Opportunity</th>
          </tr></thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">handmade jewelry</td><td className="px-6 py-4">12,400</td><td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Low</span></td><td className="px-6 py-4">25/100</td><td className="px-6 py-4 font-semibold text-purple-600">85/100</td></tr>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">custom gifts</td><td className="px-6 py-4">8,200</td><td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Medium</span></td><td className="px-6 py-4">45/100</td><td className="px-6 py-4 font-semibold text-purple-600">72/100</td></tr>
            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">vintage accessories</td><td className="px-6 py-4">6,800</td><td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Low</span></td><td className="px-6 py-4">18/100</td><td className="px-6 py-4 font-semibold text-purple-600">91/100</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}