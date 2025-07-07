import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Basic summaries",
        "5 summaries per month",
        "Standard support",
      ],
    },
    {
      name: "Pro",
      price: "$19",
      description: "For power users",
      features: [
        "Unlimited summaries",
        "Saved history",
        "Priority support",
        "Advanced insights",
      ],
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      description: "For growing teams",
      features: [
        "Everything in Pro",
        "Multiple users",
        "Team collaboration",
        "Business tools",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen"
      data-file="pages/PricingPage.js"
      data-name="pricing-page"
    >
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Fair Pricing for Everyone</h1>
          <p className="text-xl ">Choose the plan that works best for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-6 flex flex-col justify-between ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
            >
              <div>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price}
                    <span className="text-lg font-normal ">/month</span>
                  </div>
                  <p className="">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <Check />
                      <span className="">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className={`w-full ${plan.popular ? "btn-primary" : ""}`}>
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
