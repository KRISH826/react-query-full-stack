import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Package,
    ShoppingCart,
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

export function StatCards() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 py-0! gap-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10 dark:bg-zinc-900/50">
                <CardHeader className="flex flex-row items-center justify-between py-4! px-5!">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</CardTitle>
                    <div className="p-2 bg-emerald-500/10 rounded-md">
                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">$45,231.89</div>
                    <p className="text-xs font-medium flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                        <span className="text-emerald-500">+20.1%</span>
                        <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="border-0 py-0! gap-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10 dark:bg-zinc-900/50">
                <CardHeader className="flex flex-row items-center justify-between py-4! px-5!">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-md">
                        <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">+2,350</div>
                    <p className="text-xs font-medium flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                        <span className="text-emerald-500">+10.5%</span>
                        <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="border-0 py-0! gap-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10 dark:bg-zinc-900/50">
                <CardHeader className="flex flex-row items-center justify-between py-4! px-5!">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Products</CardTitle>
                    <div className="p-2 bg-amber-500/10 rounded-md">
                        <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                    <div className="text-2xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">1,205</div>
                    <p className="text-xs font-medium flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-0.5" />
                        <span className="text-emerald-500">+15</span>
                        <span className="ml-1 text-muted-foreground font-normal">added this week</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="border-0 py-0! gap-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10 dark:bg-zinc-900/50">
                <CardHeader className="flex flex-row items-center justify-between py-4! px-5!">
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Users</CardTitle>
                    <div className="p-2 bg-purple-500/10 rounded-md">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                    <div className="text-2xl font-bold bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">+12,234</div>
                    <p className="text-xs font-medium flex items-center mt-1">
                        <ArrowDownRight className="h-3 w-3 text-red-500 mr-0.5" />
                        <span className="text-red-500">-2.4%</span>
                        <span className="ml-1 text-muted-foreground font-normal">vs last month</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
