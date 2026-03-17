'use client';

import { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">AI Pricing Optimizer</h1><p className="text-gray-500 mt-1">Get AI-powered pricing recommendations</p></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Product Details</h2>
          <div><label className="text-sm font-medium text-gray-700">Product Title</label><input type="text" placeholder="e.g., Handmade Leather Wallet" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
          <div><label className="text-sm font-medium text-gray-700">Category</label><input type="text" placeholder="e.g., Accessories" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
          <div><label className="text-sm font-medium text-gray-700">Current Price</label><input type="number" placeholder="0.00" className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none" /></div>
          <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><DollarSign className="h-4 w-4" /> Analyze Pricing</button>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm text-center"><p className="text-sm text-gray-500">Recommended Price</p><p className="text-5xl font-bold text-purple-600 mt-2">$52.00</p><p className="text-sm text-gray-500 mt-2">Range: $45.00 - $65.00</p></div>
          <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Strategy</p><span className="inline-block mt-2 bg-purple-100 text-purple-800 text-lg font-medium px-4 py-2 rounded-full">Competitive Strategy</span><p className="text-sm text-gray-500 mt-4">Price competitively to capture market share while maintaining healthy margins.</p></div>
        </div>
      </div>
    </div>
  );
}