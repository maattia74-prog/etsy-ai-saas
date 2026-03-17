'use client';

import { Bell, Search } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';

export function DashboardHeader() {
  const { user } = useUser();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, keywords, competitors..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 capitalize">
          {String(user?.publicMetadata?.subscriptionTier || 'Free')} Plan
        </span>

        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}