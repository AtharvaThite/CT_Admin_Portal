import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyRupees } from "@/lib/utils";
import type { RankedItem } from "@/lib/types/dashboard";

interface RankedListCardProps {
  title: string;
  items: RankedItem[];
  formatAs?: "number" | "currency";
}

export function RankedListCard({
  title,
  items,
  formatAs = "number",
}: RankedListCardProps) {
  if (items.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...items.map((i) => i.value));

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground font-medium w-5 shrink-0">
                    {index + 1}.
                  </span>
                  <span className="truncate font-medium">{item.name}</span>
                  {item.secondaryLabel && (
                    <span className="text-xs text-muted-foreground">
                      {item.secondaryLabel}
                    </span>
                  )}
                </div>
                <span className="font-semibold shrink-0 ml-2">
                  {formatAs === "currency"
                    ? formatCurrencyRupees(item.value)
                    : item.value.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden ml-7">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
