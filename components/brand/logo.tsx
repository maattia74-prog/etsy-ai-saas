import { Search } from 'lucide-react';

interface LogoProps {
  showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-md">
        <Search className="h-4 w-4 text-white" />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-foreground">Research Platform</span>
          <span className="text-xs text-muted-foreground">Tool</span>
        </div>
      )}
    </div>
  );
}