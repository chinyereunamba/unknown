"use client";
import { motion } from "framer-motion";
import { Check, Crown, Zap } from "lucide-react";
import { useCustomer } from "autumn-js/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BillingPage = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "5 document summaries per month",
        "Basic web page summarization",
        "Standard translation",
        "Email support",
      ],
      current: true,
      popular: false,
    },
    {
      name: "Pro",
      price: "19",
      description: "Everything you need to scale",
      features: [
        "Unlimited document summaries",
        "Advanced web scraping",
        "Priority translation",
        "Custom summary templates",
        "Priority support",
        "Export in multiple formats",
      ],
      current: false,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "49",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
      ],
      current: false,
      popular: false,
    },
  ];

  const { attach } = useCustomer();

  return (
    <>
      <div className="p-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Billing & Plans</h1>
            <p className="text-muted-foreground">
              Choose the plan that works best for you
            </p>
          </div>

          {/* Current Usage */}
          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
              <CardDescription>Your usage this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">
                    Documents Summarized
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of 5 limit
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">
                    Web Pages Scraped
                  </div>
                  <div className="text-xs text-muted-foreground">unlimited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8</div>
                  <div className="text-sm text-muted-foreground">
                    Translations
                  </div>
                  <div className="text-xs text-muted-foreground">unlimited</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              >
                <Card
                  className={`h-full shadow-soft relative ${
                    plan.popular ? "ring-2 ring-primary shadow-glow" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {plan.current && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary">Current Plan</Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {plan.name === "Pro" && (
                        <Zap className="w-5 h-5 text-primary" />
                      )}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full"
                      disabled={plan.current}
                      onClick={async () =>
                        await attach({ productId: plan.name })
                      }
                      variant={
                        plan.current
                          ? "secondary"
                          : plan.popular
                            ? "default"
                            : "outline"
                      }
                    >
                      {plan.current
                        ? "Current Plan"
                        : "Upgrade to " + plan.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Payment Methods */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          ••••
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 12/25
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Primary</Badge>
                  </div>

                  <Button className="w-full" variant="outline">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default BillingPage;
