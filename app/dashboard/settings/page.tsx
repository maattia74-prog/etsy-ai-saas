import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Settings</h1><p className="text-gray-500 mt-1">Manage your account</p></div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div><h3 className="font-semibold text-lg">Free Plan</h3><p className="text-2xl font-bold mt-1">$0<span className="text-sm font-normal text-gray-500">/month</span></p></div>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Active</span>
        </div>
        <div className="mt-4 space-y-2 text-sm"><p>5 AI analyses per month</p><p>10 product searches</p><p>Basic analytics</p></div>
        <button className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">Upgrade to Pro - $29/month</button>
      </div>
    </div>
  );
}