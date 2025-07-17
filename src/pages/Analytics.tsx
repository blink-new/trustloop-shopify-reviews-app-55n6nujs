import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  MessageSquare, 
  Users, 
  ShoppingCart,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('reviews');

  // Mock data for analytics
  const overviewStats = [
    {
      title: 'Total Reviews',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Average Rating',
      value: '4.6',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Conversion Rate',
      value: '18.4%',
      change: '+3.1%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-green-600'
    },
    {
      title: 'Response Rate',
      value: '89.2%',
      change: '-2.3%',
      trend: 'down',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const topProducts = [
    { name: 'Wireless Headphones Pro', rating: 4.8, reviews: 234, revenue: '$12,450' },
    { name: 'Smart Watch Series X', rating: 4.7, reviews: 189, revenue: '$9,870' },
    { name: 'Bluetooth Speaker Mini', rating: 4.6, reviews: 156, revenue: '$7,320' },
    { name: 'USB-C Cable Premium', rating: 4.5, reviews: 143, revenue: '$5,680' },
    { name: 'Phone Case Ultra', rating: 4.4, reviews: 128, revenue: '$4,290' }
  ];

  const ratingDistribution = [
    { stars: 5, count: 1420, percentage: 65 },
    { stars: 4, count: 487, percentage: 22 },
    { stars: 3, count: 198, percentage: 9 },
    { stars: 2, count: 76, percentage: 3 },
    { stars: 1, count: 23, percentage: 1 }
  ];

  const recentActivity = [
    { type: 'review', user: 'Sarah M.', product: 'Wireless Headphones Pro', rating: 5, time: '2 hours ago' },
    { type: 'response', user: 'Store Owner', product: 'Smart Watch Series X', time: '4 hours ago' },
    { type: 'review', user: 'John D.', product: 'Bluetooth Speaker Mini', rating: 4, time: '6 hours ago' },
    { type: 'review', user: 'Emma L.', product: 'USB-C Cable Premium', rating: 5, time: '8 hours ago' },
    { type: 'response', user: 'Store Owner', product: 'Phone Case Ultra', time: '1 day ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Track your review performance and customer insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Review Trends</CardTitle>
                <CardDescription>Reviews received over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm">Showing {timeRange} data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Impact</CardTitle>
                <CardDescription>Sales impact from reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Products with reviews</span>
                    <span className="font-semibold">+23% conversion</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Products without reviews</span>
                    <span className="font-semibold">12% conversion</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="text-center pt-2">
                    <Badge variant="secondary">
                      Reviews increase conversion by 92%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products ranked by review performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {product.rating}
                          </div>
                          <span>•</span>
                          <span>{product.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.revenue}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Breakdown of customer ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm">{rating.stars}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <Progress value={rating.percentage} className="h-2" />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground w-20">
                      <span>{rating.count}</span>
                      <span>({rating.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Rating</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= 4.6 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">4.6 out of 5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest reviews and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'review' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{activity.user}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type === 'review' ? 'Review' : 'Response'}
                        </Badge>
                        {activity.rating && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{activity.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.product}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}