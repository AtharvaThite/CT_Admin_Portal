"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyRupees } from "@/lib/utils";
import type { ChartDataPoint } from "@/lib/types/dashboard";

interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  type: "line" | "bar" | "area";
  color?: string;
  formatAs?: "number" | "currency";
}

export function ChartCard({
  title,
  data,
  type,
  color = "var(--color-chart-1)",
  formatAs = "number",
}: ChartCardProps) {
  const valueFormatter = formatAs === "currency"
    ? (v: number) => formatCurrencyRupees(v)
    : (v: number) => String(v);
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-foreground)",
                  }}
                  formatter={(value) => [valueFormatter(value as number), title]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: color }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : type === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-foreground)",
                  }}
                  formatter={(value) => [valueFormatter(value as number), title]}
                />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-foreground)",
                  }}
                  formatter={(value) => [valueFormatter(value as number), title]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
