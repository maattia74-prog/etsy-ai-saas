'use client';

export default function AIAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">AI Analytics</h1><p className="text-gray-500 mt-1">Track your AI usage and performance</p></div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Total Analyses</p><p className="text-2xl font-bold mt-2">47</p><p className="text-xs text-gray-500">This month</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Total Cost</p><p className="text-2xl font-bold mt-2">$0.12</p><p className="text-xs text-gray-500">Very efficient!</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Avg Confidence</p><p className="text-2xl font-bold mt-2">89.2%</p><p className="text-xs text-gray-500">AI accuracy</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Most Used</p><p className="text-2xl font-bold mt-2">Pricing</p><p className="text-xs text-gray-500">12 analyses</p></div>
      </div>
    </div>
  );
}