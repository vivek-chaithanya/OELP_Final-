import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Download, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Subscriptions = () => {
  const plans = [
    {
      name: "Main",
      price: "$29/month",
      features: ["5 Fields", "Basic Reports", "Email Support", "Mobile App"],
      current: false,
    },
    {
      name: "Top-up",
      price: "$59/month",
      features: ["15 Fields", "Advanced Analytics", "Priority Support", "API Access", "Soil Analysis"],
      current: true,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$129/month",
      features: ["Unlimited Fields", "Custom Reports", "24/7 Support", "White Label", "Multi-user", "Advanced AI"],
      current: false,
    },
  ];

  const billingHistory = [
    { id: "INV-001", date: "2024-01-15", plan: "Top-up", amount: "$59.00", status: "Paid" },
    { id: "INV-002", date: "2023-12-15", plan: "Top-up", amount: "$59.00", status: "Paid" },
    { id: "INV-003", date: "2023-11-15", plan: "Main", amount: "$29.00", status: "Paid" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground">Manage your subscription plans and billing</p>
      </div>

      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Current Subscription: Top-up Plan</CardTitle>
              <CardDescription>Your subscription renews on February 15, 2025</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">$59.00<span className="text-sm text-muted-foreground">/month</span></p>
              <p className="text-sm text-muted-foreground">Next billing: Feb 15, 2024</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button>Upgrade Plan</Button>
            <Button variant="outline">Downgrade Plan</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.popular && <Badge>Popular</Badge>}
                </div>
                <p className="text-3xl font-bold text-primary">{plan.price}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Button className="w-full" disabled>Current Plan</Button>
                ) : (
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Select {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Badge variant="secondary">Primary</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.plan}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
