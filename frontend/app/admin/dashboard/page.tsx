import React from 'react';
import { StatCards } from '@/components/admin/dashboard/StatCards';
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart';
import { SalesChart } from '@/components/admin/dashboard/SalesChart';

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0 mb-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
                    <p className="text-muted-foreground mt-0.5 text-xs">Overview of your store&apos;s performance.</p>
                </div>
            </div>
            <div className="content space-y-5 lg:mt-10 md:mt-8 mt-6">
                <StatCards />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-2">
                    <RevenueChart />
                    <SalesChart />
                </div>
            </div>
        </div>
    );
}
