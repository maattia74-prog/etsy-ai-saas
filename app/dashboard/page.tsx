import { ShoppingBag, Search, Users, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Research Platform Tool</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Products Tracked" value="124" description="Total products" icon={ShoppingBag} trend={{ value: 12, isPositive: true }} />
        <StatsCard title="Keywords Analyzed" value="89" description="Keywords researched" icon={Search} trend={{ value: 8, isPositive: true }} />
        <StatsCard title="Competitors" value="15" description="Tracked competitors" icon={Users} />
        <StatsCard title="AI Analyses" value="3/5" description="This month" icon={Sparkles} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Products</h2>
            <Link href="/dashboard/products" className="text-sm text-purple-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div><p className="text-sm font-medium">Handmade Leather Wallet</p><p className="text-xs text-gray-500">$45.00</p></div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">120 sales</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div><p className="text-sm font-medium">Custom Jewelry Box</p><p className="text-xs text-gray-500">$68.00</p></div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">89 sales</span>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Vintage Canvas Bag</p><p className="text-xs text-gray-500">$35.00</p></div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">201 sales</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent AI Analyses</h2>
            <Link href="/dashboard/ai-analytics" className="text-sm text-purple-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div><p className="text-sm font-medium">Pricing Analysis</p><p className="text-xs text-gray-500">2 hours ago</p></div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">groq</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div><p className="text-sm font-medium">Trend Prediction</p><p className="text-xs text-gray-500">5 hours ago</p></div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">openai</span>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Competitor Analysis</p><p className="text-xs text-gray-500">1 day ago</p></div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">together</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <Link href="/dashboard/products" className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <ShoppingBag className="h-4 w-4" /> Search Products
          </Link>
          <Link href="/dashboard/keywords" className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Search className="h-4 w-4" /> Analyze Keywords
          </Link>
          <Link href="/dashboard/competitors" className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Users className="h-4 w-4" /> Track Competitor
          </Link>
          <Link href="/dashboard/pricing" className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <DollarSign className="h-4 w-4" /> Optimize Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}