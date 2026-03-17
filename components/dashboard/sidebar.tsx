'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Search,
  TrendingUp,
  Users,
  Sparkles,
  DollarSign,
  Lightbulb,
  BarChart3,
  Settings,
  Key,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/brand/logo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
  { name: 'Keywords', href: '/dashboard/keywords', icon: Search },
  { name: 'Trends', href: '/dashboard/trends', icon: TrendingUp },
  { name: 'Competitors', href: '/dashboard/competitors', icon: Users },
  { name: 'AI Analytics', href: '/dashboard/ai-analytics', icon: Sparkles },
  { name: 'Pricing', href: '/dashboard/pricing', icon: DollarSign },
  { name: 'Opportunities', href: '/dashboard/opportunities', icon: Lightbulb },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Your Account</p>
            <p className="text-xs text-gray-500 truncate">Manage settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}