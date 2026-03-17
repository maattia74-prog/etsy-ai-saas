'use client';

import { useState } from 'react';
import { Plus, Sparkles, ExternalLink } from 'lucide-react';

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Competitors</h1><p className="text-gray-500 mt-1">Track and analyze your competition</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><Plus className="h-4 w-4" /> Add Competitor</button>
      </div>
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left font-medium text-gray-500">Competitor</th><th className="px-6 py-3 text-left font-medium text-gray-500">Products</th><th className="px-6 py-3 text-left font-medium text-gray-500">Avg Price</th><th className="px-6 py-3 text-left font-medium text-gray-500">Est. Sales</th><th className="px-6 py-3 text-left font-medium text-gray-500">Actions</th></tr></thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">HandmadeByJane</td><td className="px-6 py-4">142</td><td className="px-6 py-4">$52.00</td><td className="px-6 py-4">3,200</td><td className="px-6 py-4"><button className="flex items-center gap-1 text-purple-600 text-xs font-medium hover:underline"><Sparkles className="h-3 w-3" /> Analyze</button></td></tr>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">CraftedLuxury</td><td className="px-6 py-4">89</td><td className="px-6 py-4">$78.00</td><td className="px-6 py-4">1,800</td><td className="px-6 py-4"><button className="flex items-center gap-1 text-purple-600 text-xs font-medium hover:underline"><Sparkles className="h-3 w-3" /> Analyze</button></td></tr>
            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">VintageFinds</td><td className="px-6 py-4">234</td><td className="px-6 py-4">$32.00</td><td className="px-6 py-4">5,400</td><td className="px-6 py-4"><button className="flex items-center gap-1 text-purple-600 text-xs font-medium hover:underline"><Sparkles className="h-3 w-3" /> Analyze</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}