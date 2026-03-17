'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-gray-500 mt-1">Search and analyze products with AI</p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">AI-Powered Product Search</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for products using natural language..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button onClick={handleSearch} disabled={loading} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Product</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Price</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Sales</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Rating</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">Category</th>
          </tr></thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">Handmade Leather Wallet</td><td className="px-6 py-4">$45.00</td><td className="px-6 py-4">120</td><td className="px-6 py-4">4.8</td><td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Accessories</span></td></tr>
            <tr className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-medium">Custom Jewelry Box</td><td className="px-6 py-4">$68.00</td><td className="px-6 py-4">89</td><td className="px-6 py-4">4.9</td><td className="px-6 py-4"><span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">Jewelry</span></td></tr>
            <tr className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">Vintage Canvas Bag</td><td className="px-6 py-4">$35.00</td><td className="px-6 py-4">201</td><td className="px-6 py-4">4.7</td><td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Bags</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}