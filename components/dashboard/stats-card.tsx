interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={trend.isPositive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
}