import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChartDataPoint {
  date: string;
  reviews: number;
  rating: number;
  conversion: number;
}

interface InteractiveChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  metric: 'reviews' | 'rating' | 'conversion';
  timeRange: '7d' | '30d' | '90d';
  onTimeRangeChange: (range: '7d' | '30d' | '90d') => void;
  onMetricChange: (metric: 'reviews' | 'rating' | 'conversion') => void;
}

// Mock data generator
const generateMockData = (days: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      reviews: Math.floor(Math.random() * 50) + 10,
      rating: 3.5 + Math.random() * 1.5,
      conversion: Math.random() * 30 + 10
    });
  }
  
  return data;
};

const getMetricConfig = (metric: 'reviews' | 'rating' | 'conversion') => {
  switch (metric) {
    case 'reviews':
      return {
        label: 'Reviews',
        color: 'bg-blue-500',
        unit: '',
        format: (value: number) => value.toString()
      };
    case 'rating':
      return {
        label: 'Average Rating',
        color: 'bg-yellow-500',
        unit: '/5',
        format: (value: number) => value.toFixed(1)
      };
    case 'conversion':
      return {
        label: 'Conversion Rate',
        color: 'bg-green-500',
        unit: '%',
        format: (value: number) => value.toFixed(1)
      };
  }
};

export function InteractiveChart({
  title,
  description,
  data,
  metric,
  timeRange,
  onTimeRangeChange,
  onMetricChange
}: InteractiveChartProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const metricConfig = getMetricConfig(metric);
  const currentValue = data.length > 0 ? data[data.length - 1][metric] : 0;
  const previousValue = data.length > 1 ? data[data.length - 2][metric] : 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
  
  const maxValue = Math.max(...data.map(d => d[metric]));
  const minValue = Math.min(...data.map(d => d[metric]));
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge variant="outline" className="text-xs">
                {metricConfig.label}
              </Badge>
            </CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={metric} onValueChange={onMetricChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="90d">90d</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Current Value & Trend */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-3xl font-bold">
              {metricConfig.format(currentValue)}{metricConfig.unit}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {change !== 0 && (
                <>
                  {change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    "font-medium",
                    change > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {change > 0 ? '+' : ''}{metricConfig.format(change)}{metricConfig.unit}
                  </span>
                  <span className="text-muted-foreground">
                    ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>Max: {metricConfig.format(maxValue)}{metricConfig.unit}</div>
            <div>Min: {metricConfig.format(minValue)}{metricConfig.unit}</div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last {timeRange}</span>
            <span>{data.length} data points</span>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="h-32 flex items-end justify-between gap-1">
            {data.map((point, index) => {
              const height = ((point[metric] - minValue) / (maxValue - minValue)) * 100;
              const isLast = index === data.length - 1;
              
              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  <div
                    className={cn(
                      "w-full rounded-t transition-all duration-200 hover:opacity-80",
                      metricConfig.color,
                      isLast && "ring-2 ring-primary ring-offset-1"
                    )}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      <div>{new Date(point.date).toLocaleDateString()}</div>
                      <div className="font-semibold">
                        {metricConfig.format(point[metric])}{metricConfig.unit}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Date Labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{new Date(data[0]?.date).toLocaleDateString()}</span>
            <span>{new Date(data[data.length - 1]?.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm font-medium">
              {metricConfig.format(data.reduce((sum, d) => sum + d[metric], 0) / data.length)}{metricConfig.unit}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">
              {metricConfig.format(maxValue)}{metricConfig.unit}
            </div>
            <div className="text-xs text-muted-foreground">Peak</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">
              {data.filter(d => d[metric] > (data.reduce((sum, d) => sum + d[metric], 0) / data.length)).length}
            </div>
            <div className="text-xs text-muted-foreground">Above Avg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing chart data
export function useChartData() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metric, setMetric] = useState<'reviews' | 'rating' | 'conversion'>('reviews');
  
  const getDays = (range: '7d' | '30d' | '90d') => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
    }
  };
  
  const data = generateMockData(getDays(timeRange));
  
  return {
    data,
    timeRange,
    metric,
    setTimeRange,
    setMetric
  };
}