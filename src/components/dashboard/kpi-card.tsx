import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-teal-600 dark:text-teal-400",
  iconBg = "bg-teal-100 dark:bg-teal-900/30",
}: KPICardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change !== undefined && change !== 0 && (
              <p
                className={cn(
                  "text-xs font-medium",
                  change > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {change > 0 ? "+" : ""}
                {change}% from last month
              </p>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
