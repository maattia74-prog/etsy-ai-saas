export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Analytics</h1><p className="text-gray-500 mt-1">Track your platform usage</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Total Searches</p><p className="text-2xl font-bold mt-2">1,247</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Products Tracked</p><p className="text-2xl font-bold mt-2">124</p></div>
        <div className="rounded-lg border bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Reports Generated</p><p className="text-2xl font-bold mt-2">38</p></div>
      </div>
    </div>
  );
}