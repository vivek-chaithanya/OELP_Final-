import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { DollarSign, Users, TrendingUp, CreditCard } from "lucide-react";
import usePlatformData from "@/lib/usePlatformData";

const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";

interface PlanRow { id: number; name: string; price: string; type: string; }

export default function AdminSubscriptions() {
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const { adminAnalytics, transactions: hookTx = [], plans: hookPlans = [], loading } = usePlatformData();

  const [metrics, setMetrics] = useState({
    total_revenue: 0,
    active_subscriptions: 0,
    total_plans: 0,
    monthly_revenue: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const loadData = async () => {
      try {
        // Fetch plans and all user subscriptions
        const [plansRes, subscriptionsRes] = await Promise.all([
          fetch(`${API_URL}/plans/`, { headers: { Authorization: `Token ${token}` } }),
          fetch(`${API_URL}/subscriptions/`, { headers: { Authorization: `Token ${token}` } })
        ]);

        const plansData = plansRes.ok ? await plansRes.json() : { results: [] };
        const subscriptionsData = subscriptionsRes.ok ? await subscriptionsRes.json() : { results: [] };

        const plansItems = Array.isArray(plansData?.results) ? plansData.results : (Array.isArray(plansData) ? plansData : []);
        const subscriptionsItems = Array.isArray(subscriptionsData?.results) ? subscriptionsData.results : (Array.isArray(subscriptionsData) ? subscriptionsData : []);

        setPlans(plansItems);
        setSubscriptions(subscriptionsItems);

        // Compute metrics: prefer adminAnalytics from hook
        if (adminAnalytics) {
          const s = adminAnalytics.stats || {};
          // active_subscriptions: sum of plan_distribution values (active user plans by plan)
          const planDist = Array.isArray(adminAnalytics.plan_distribution) ? adminAnalytics.plan_distribution : [];
          const activeSubsFromDist = planDist.reduce((acc:any, p:any) => acc + (Number(p.value) || 0), 0);

          // monthly_revenue: sum revenue_by_day (actually last 7 days from backend)
          const revenueByDay = Array.isArray(adminAnalytics.revenue_by_day) ? adminAnalytics.revenue_by_day : [];
          const recentRevenue = revenueByDay.reduce((a:any, b:any) => a + (Number(b.value) || 0), 0);

          setMetrics({
            total_revenue: Number(s.total_revenue) || 0,
            active_subscriptions: activeSubsFromDist || subscriptionsItems.filter((sub: any) => sub.is_active !== false).length,
            total_plans: plansItems.length,
            monthly_revenue: recentRevenue
          });
        } else {
          // Fallback calculation from fetched subscriptions (less accurate)
          const activeSubscriptions = subscriptionsItems.filter((sub: any) => sub.is_active !== false).length;

          setMetrics({
            total_revenue: 0, // Can't calculate without transaction data
            active_subscriptions: activeSubscriptions,
            total_plans: plansItems.length,
            monthly_revenue: 0
          });
        }

      } catch (error) {
        console.error('Error loading subscription data:', error);
      }
    };

    loadData();
  }, [adminAnalytics]);

  // Keep metrics in sync when adminAnalytics updates
  useEffect(() => {
    if (!adminAnalytics) return;
    const s = adminAnalytics.stats || {};
    const planDist = Array.isArray(adminAnalytics.plan_distribution) ? adminAnalytics.plan_distribution : [];
    const activeSubsFromDist = planDist.reduce((acc:any, p:any) => acc + (Number(p.value) || 0), 0);
    const revenueByDay = Array.isArray(adminAnalytics.revenue_by_day) ? adminAnalytics.revenue_by_day : [];
    const weeklyRevenue = revenueByDay.reduce((a:any, b:any) => a + (Number(b.value) || 0), 0);
    
    setMetrics((m) => ({ 
      ...m,
      total_revenue: Number(s.total_revenue) || m.total_revenue,
      active_subscriptions: activeSubsFromDist || m.active_subscriptions,
      monthly_revenue: weeklyRevenue || Number(s.weekly_revenue) || m.monthly_revenue
    }));
  }, [adminAnalytics]);

  // Update plans list when hook provides data
  useEffect(() => {
    if (Array.isArray(hookPlans) && hookPlans.length > 0) {
      setPlans(hookPlans);
    }
  }, [hookPlans]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">Manage subscription plans and monitor revenue</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{metrics.total_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time (net of refunds)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.active_subscriptions}</div>
            <p className="text-xs text-muted-foreground">Current users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{metrics.total_plans}</div>
            <p className="text-xs text-muted-foreground">Available plans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{metrics.monthly_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage available subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{plan.name === 'Basic' ? 'Main' : plan.name}</CardTitle>
                    {plan.type === "main" && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Popular</span>}
                  </div>
                  <p className="text-2xl font-bold text-primary">₹{plan.price}<span className="text-sm text-muted-foreground">/period</span></p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Plan type: {plan.type}</p>
                </CardContent>
              </Card>
            ))}
            {plans.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-3">No plans configured yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
          <CardDescription>Latest subscription activities (excluding Free plan)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subscriptions.filter((sub) => sub.plan?.name?.toLowerCase() !== 'free').length > 0 ? (
              subscriptions.filter((sub) => sub.plan?.name?.toLowerCase() !== 'free').slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sub.user?.full_name || sub.user?.username || sub.user?.email || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">{sub.plan?.name || sub.plan_name || 'No Plan'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{((sub.plan?.price || sub.plan_price || 0)).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{(sub.created_at || sub.start_date || '').slice(0, 10) || 'N/A'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No paid subscribers yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
