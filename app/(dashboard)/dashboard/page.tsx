"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Globe, Plus, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const stats = [
    {
      title: "Total Summaries",
      value: "24",
      description: "Documents processed",
      icon: <FileText className="w-6 h-6 text-primary" />,
      trend: "+12% from last month",
    },
    {
      title: "Scraped Pages",
      value: "18",
      description: "Websites summarized",
      icon: <Globe className="w-6 h-6 text-primary" />,
      trend: "+8% from last month",
    },
    {
      title: "Words Saved",
      value: "45.2K",
      description: "Time saved reading",
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      trend: "+23% from last month",
    },
  ];

  const { data: session } = useSession()

  if (!session) {
    return redirect("/sign-in");
  }

  return (
    <>
      <div className="p-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your summaries today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Card className="shadow-soft">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump into your most common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/input">
                      <Plus className="w-4 h-4 mr-2" />
                      New Summary
                    </Link>
                  </Button>
                  <Button asChild className="flex-1" variant="outline">
                    <Link href="/summaries">
                      <FileText className="w-4 h-4 mr-2" />
                      View All Summaries
                    </Link>
                  </Button>
                  <Button asChild className="flex-1" variant="outline">
                    <Link href="/billing">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest summaries and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Document",
                      title: "Q4 Financial Report.pdf",
                      time: "2 hours ago",
                    },
                    {
                      type: "Webpage",
                      title: "TechCrunch Article",
                      time: "5 hours ago",
                    },
                    { type: "Text", title: "Meeting Notes", time: "1 day ago" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.type}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default DashboardPage;
