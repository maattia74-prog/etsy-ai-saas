'use client';

import { Lightbulb, Sparkles, TrendingUp, Bookmark } from 'lucide-react';

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Opportunities</h1><p className="text-gray-500 mt-1">AI-discovered opportunities to grow</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><Sparkles className="h-4 w-4" /> Generate New</button>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Lightbulb className="h-5 w-5 text-purple-600" /></div><div><h3 className="font-semibold">High Opportunity: Handmade Jewelry</h3><div className="flex gap-2 mt-1"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">keyword</span><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">easy</span></div></div></div><div className="text-right"><p className="text-2xl font-bold text-purple-600">92<span className="text-sm text-gray-500">/100</span></p></div></div>
          <p className="text-sm text-gray-500 mt-3">Low competition keyword with 12,400 monthly searches. Great opportunity to create targeted listings.</p>
          <p className="text-sm text-green-600 font-medium mt-2">Potential Revenue: $5,200/month</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><TrendingUp className="h-5 w-5 text-blue-600" /></div><div><h3 className="font-semibold">Trending: Sustainable Products</h3><div className="flex gap-2 mt-1"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">niche</span><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">medium</span></div></div></div><div className="text-right"><p className="text-2xl font-bold text-purple-600">78<span className="text-sm text-gray-500">/100</span></p></div></div>
          <p className="text-sm text-gray-500 mt-3">Growing 23% month-over-month. Early mover advantage available.</p>
        </div>
      </div>
    </div>
  );
}