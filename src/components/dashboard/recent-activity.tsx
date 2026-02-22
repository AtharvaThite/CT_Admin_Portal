import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, UserPlus, ShoppingBag } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { RecentActivity as RecentActivityType } from "@/lib/types/dashboard";

const iconMap = {
  booking: CalendarCheck,
  signup: UserPlus,
  order: ShoppingBag,
};

const colorMap = {
  booking: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  signup: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  order: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

interface RecentActivityProps {
  activities: RecentActivityType[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = iconMap[activity.type];
              const colorClass = colorMap[activity.type];
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
