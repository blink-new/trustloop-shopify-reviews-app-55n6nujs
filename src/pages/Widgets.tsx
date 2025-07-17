import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Slider } from '../components/ui/slider';
import { Textarea } from '../components/ui/textarea';
import { 
  Palette, 
  Monitor, 
  Smartphone, 
  Eye, 
  Code, 
  Settings, 
  Star,
  MessageSquare,
  Image,
  Play,
  Copy,
  Download,
  Zap
} from 'lucide-react';

export default function Widgets() {
  const [selectedWidget, setSelectedWidget] = useState('product-page');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [widgetSettings, setWidgetSettings] = useState({
    primaryColor: '#6366F1',
    accentColor: '#10B981',
    borderRadius: 8,
    showRating: true,
    showReviewCount: true,
    showImages: true,
    maxReviews: 5,
    sortBy: 'newest'
  });

  const widgetTypes = [
    {
      id: 'product-page',
      name: 'Product Page Widget',
      description: 'Display reviews directly on product pages',
      icon: Star,
      features: ['Star ratings', 'Review list', 'Photo carousel', 'Filtering'],
      usage: 'High',
      status: 'active'
    },
    {
      id: 'collection-page',
      name: 'Collection Page Widget',
      description: 'Show ratings on collection and category pages',
      icon: MessageSquare,
      features: ['Star ratings', 'Review count', 'Quick preview'],
      usage: 'Medium',
      status: 'active'
    },
    {
      id: 'homepage-slider',
      name: 'Homepage Review Slider',
      description: 'Featured reviews carousel for homepage',
      icon: Image,
      features: ['Featured reviews', 'Auto-play', 'Responsive design'],
      usage: 'Medium',
      status: 'active'
    },
    {
      id: 'floating-button',
      name: 'Floating Button Widget',
      description: 'Fixed position review button',
      icon: Zap,
      features: ['Fixed position', 'Modal popup', 'Customizable CTA'],
      usage: 'Low',
      status: 'inactive'
    },
    {
      id: 'popup-widget',
      name: 'Popup Widget',
      description: 'Timed or scroll-triggered review popup',
      icon: Play,
      features: ['Trigger conditions', 'Lead capture', 'Exit intent'],
      usage: 'Low',
      status: 'inactive'
    },
    {
      id: 'thankyou-page',
      name: 'Thank You Page Widget',
      description: 'Post-purchase review request',
      icon: Copy,
      features: ['Post-purchase', 'Incentive offers', 'Discount codes'],
      usage: 'High',
      status: 'active'
    }
  ];

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedWidgetData = widgetTypes.find(w => w.id === selectedWidget);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Widget Builder</h2>
          <p className="text-muted-foreground">Customize and deploy review widgets across your store</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Code className="h-4 w-4 mr-2" />
            Get Code
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Widget Types</CardTitle>
              <CardDescription>Choose a widget to customize</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {widgetTypes.map((widget) => {
                const Icon = widget.icon;
                return (
                  <div
                    key={widget.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWidget === widget.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedWidget(widget.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{widget.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Badge className={getUsageColor(widget.usage)} variant="secondary">
                              {widget.usage}
                            </Badge>
                            <Badge className={getStatusColor(widget.status)} variant="secondary">
                              {widget.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{widget.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {widget.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {widget.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{widget.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Widget Customization */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Design Customization</CardTitle>
                  <CardDescription>Customize the appearance of your {selectedWidgetData?.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: widgetSettings.primaryColor }}
                        />
                        <Input 
                          value={widgetSettings.primaryColor}
                          onChange={(e) => setWidgetSettings({...widgetSettings, primaryColor: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: widgetSettings.accentColor }}
                        />
                        <Input 
                          value={widgetSettings.accentColor}
                          onChange={(e) => setWidgetSettings({...widgetSettings, accentColor: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Radius: {widgetSettings.borderRadius}px</Label>
                    <Slider
                      value={[widgetSettings.borderRadius]}
                      onValueChange={(value) => setWidgetSettings({...widgetSettings, borderRadius: value[0]})}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Display Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-rating">Show Star Rating</Label>
                        <Switch 
                          id="show-rating"
                          checked={widgetSettings.showRating}
                          onCheckedChange={(checked) => setWidgetSettings({...widgetSettings, showRating: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-count">Show Review Count</Label>
                        <Switch 
                          id="show-count"
                          checked={widgetSettings.showReviewCount}
                          onCheckedChange={(checked) => setWidgetSettings({...widgetSettings, showReviewCount: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-images">Show Review Images</Label>
                        <Switch 
                          id="show-images"
                          checked={widgetSettings.showImages}
                          onCheckedChange={(checked) => setWidgetSettings({...widgetSettings, showImages: checked})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>Configure what content to display</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maximum Reviews to Show</Label>
                      <Select 
                        value={widgetSettings.maxReviews.toString()}
                        onValueChange={(value) => setWidgetSettings({...widgetSettings, maxReviews: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Reviews</SelectItem>
                          <SelectItem value="5">5 Reviews</SelectItem>
                          <SelectItem value="10">10 Reviews</SelectItem>
                          <SelectItem value="20">20 Reviews</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sort Reviews By</Label>
                      <Select 
                        value={widgetSettings.sortBy}
                        onValueChange={(value) => setWidgetSettings({...widgetSettings, sortBy: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="highest">Highest Rating</SelectItem>
                          <SelectItem value="lowest">Lowest Rating</SelectItem>
                          <SelectItem value="helpful">Most Helpful</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom CSS</Label>
                    <Textarea 
                      placeholder="Add custom CSS styles..."
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Behavior Settings</CardTitle>
                  <CardDescription>Configure how the widget behaves</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-load Reviews</Label>
                        <p className="text-sm text-muted-foreground">Load reviews automatically when widget appears</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Pagination</Label>
                        <p className="text-sm text-muted-foreground">Allow users to browse through more reviews</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show "Write Review" Button</Label>
                        <p className="text-sm text-muted-foreground">Display button to encourage new reviews</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Review Filtering</Label>
                        <p className="text-sm text-muted-foreground">Allow customers to filter reviews by rating</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  {selectedWidget === 'popup-widget' && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Popup Triggers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Trigger Type</Label>
                          <Select defaultValue="time">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="time">Time Delay</SelectItem>
                              <SelectItem value="scroll">Scroll Percentage</SelectItem>
                              <SelectItem value="exit">Exit Intent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Delay (seconds)</Label>
                          <Input type="number" defaultValue="5" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Widget Preview</CardTitle>
                      <CardDescription>See how your widget will look</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewDevice('desktop')}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewDevice('mobile')}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`border rounded-lg p-4 ${previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                    <div className="space-y-4">
                      {/* Mock widget preview */}
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        {widgetSettings.showReviewCount && (
                          <span className="text-sm text-muted-foreground">(127 reviews)</span>
                        )}
                      </div>

                      <div className="space-y-3">
                        {[1, 2, 3].slice(0, Math.min(3, widgetSettings.maxReviews)).map((review) => (
                          <div key={review} className="border rounded p-3" style={{ borderRadius: `${widgetSettings.borderRadius}px` }}>
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full" />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">Customer {review}</span>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Great product! Really happy with my purchase. Would definitely recommend to others.
                                </p>
                                {widgetSettings.showImages && (
                                  <div className="flex space-x-2 mt-2">
                                    <div className="w-12 h-12 bg-gray-200 rounded" />
                                    <div className="w-12 h-12 bg-gray-200 rounded" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full" 
                        style={{ backgroundColor: widgetSettings.primaryColor }}
                      >
                        Write a Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}