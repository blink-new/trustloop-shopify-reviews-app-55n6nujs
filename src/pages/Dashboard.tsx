import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { InteractiveChart, useChartData } from '../components/ui/interactive-chart';
import { 
  BarChart3, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Clock, 
  ShoppingBag, 
  MessageSquare, 
  Zap,
  Store,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center pt-1">
        {trend && (
          <span 
            className={cn(
              "flex items-center text-xs mr-2", 
              trend.isPositive ? "text-accent" : "text-destructive"
            )}
          >
            {trend.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {trend.value}%
          </span>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [isStoreConnected, setIsStoreConnected] = useState(false);
  const [storeName, setStoreName] = useState('');
  const chartData = useChartData();

  useEffect(() => {
    // Check if store is connected
    const savedData = localStorage.getItem('trustloop_store_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setIsStoreConnected(data.status === 'connected');
        setStoreName(data.name || 'Your Store');
      } catch (error) {
        console.error('Failed to parse saved store data:', error);
      }
    }
  }, []);

  const stats = [
    {
      title: 'Total Reviews',
      value: isStoreConnected ? '2,458' : '0',
      description: 'vs last month',
      icon: <Star size={18} className="text-primary" />,
      trend: isStoreConnected ? { value: 12.5, isPositive: true } : undefined,
    },
    {
      title: 'Conversion Rate',
      value: isStoreConnected ? '24.3%' : '0%',
      description: 'reviews to purchase',
      icon: <Zap size={18} className="text-accent" />,
      trend: isStoreConnected ? { value: 5.2, isPositive: true } : undefined,
    },
    {
      title: 'Avg. Rating',
      value: isStoreConnected ? '4.7' : '0',
      description: 'out of 5 stars',
      icon: <Star size={18} className="text-yellow-500" />,
      trend: isStoreConnected ? { value: 0.3, isPositive: true } : undefined,
    },
    {
      title: 'Response Time',
      value: isStoreConnected ? '6.5h' : '0h',
      description: 'average response',
      icon: <Clock size={18} className="text-primary" />,
      trend: isStoreConnected ? { value: 12, isPositive: false } : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {isStoreConnected && (
            <p className="text-muted-foreground">Welcome back! Here's what's happening with {storeName}.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isStoreConnected ? (
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <CheckCircle size={14} className="mr-1" />
              Store Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              <AlertCircle size={14} className="mr-1" />
              Setup Required
            </Badge>
          )}
          <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
            BETA
          </div>
        </div>
      </div>

      {!isStoreConnected && (
        <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Store size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Connect Your Shopify Store</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get started by connecting your Shopify store to unlock all TrustLoop features including review collection, Q&A management, and email campaigns.
                </p>
                <Link to="/store-setup">
                  <Button className="gap-2">
                    Get Started
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <InteractiveChart
            title="Performance Analytics"
            description="Track your key metrics over time"
            data={chartData.data}
            metric={chartData.metric}
            timeRange={chartData.timeRange}
            onMetricChange={chartData.setMetric}
            onTimeRangeChange={chartData.setTimeRange}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Highest-rated products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                    <ShoppingBag size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Product {i + 1}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={12}
                            className={j < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({Math.floor(Math.random() * 100) + 50})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>
              Latest customer feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </div>
                      <span className="text-sm font-medium">Customer {i + 1}</span>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={14}
                          className={j < 5 - i ? "text-yellow-500 fill-yellow-500" : "text-muted"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {i + 1} day{i !== 0 ? 's' : ''} ago
                    </span>
                    <span className="text-xs text-primary font-medium cursor-pointer">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Q&A</CardTitle>
            <CardDescription>
              Latest customer questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <MessageSquare size={14} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        How long does the battery last under heavy usage?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Asked by Customer {i + 1} • {i + 1} day{i !== 0 ? 's' : ''} ago
                      </p>

                      {i < 2 && (
                        <div className="mt-3 pl-4 border-l-2 border-accent/20">
                          <p className="text-sm">
                            The battery typically lasts 8-10 hours under heavy usage conditions.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Answered by Store Admin • {i} day{i !== 1 ? 's' : ''} ago
                          </p>
                        </div>
                      )}

                      {i === 2 && (
                        <div className="mt-3 pl-4 border-l-2 border-destructive/20">
                          <p className="text-sm text-muted-foreground italic">
                            No answer yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}