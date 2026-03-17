'use client';

import { useState } from 'react';
import { TrendingUp, Search, Loader2 } from 'lucide-react';

export default function TrendsPage() {
  const [keyword, setKeyword] = useState('');

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Trend Analysis</h1><p className="text-gray-500 mt-1">Predict market trends with AI</p></div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex gap-2">
          <input type="text" placeholder="Enter keyword to analyze trend..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none" />
          <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><TrendingUp className="h-4 w-4" /> Analyze</button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Trend Direction</p><div className="flex items-center gap-2 mt-2"><TrendingUp className="h-8 w-8 text-green-500" /><span className="text-2xl font-bold">Growing</span></div><span className="inline-block mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+15.2% growth</span></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Confidence</p><p className="text-3xl font-bold mt-2">87%</p><p className="text-xs text-gray-500 mt-1">AI prediction confidence</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Peak Months</p><div className="flex flex-wrap gap-2 mt-2"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">November</span><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">December</span><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">February</span></div></div>
      </div>
    </div>
  );
}