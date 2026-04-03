"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 40 },
  { name: 'Tue', sales: 30 },
  { name: 'Wed', sales: 45 },
  { name: 'Thu', sales: 50 },
  { name: 'Fri', sales: 65 },
  { name: 'Sat', sales: 85 },
  { name: 'Sun', sales: 60 },
];

export function SalesChart() {
  return (
    <Card className="col-span-1 lg:col-span-3 py-0! gap-0! border-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10 dark:bg-zinc-900/50 flex flex-col">
      <CardHeader className="px-5 gap-0! py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Weekly Sales</CardTitle>
            <CardDescription className="mt-0.5 text-xs">Sales performance over the last 7 days.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#e5e7eb', opacity: 0.2 }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
