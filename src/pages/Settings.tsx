import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  Settings as SettingsIcon, 
  Store, 
  Mail, 
  Palette, 
  Shield, 
  Zap, 
  CreditCard,
  Users,
  Save,
  Plus,
  Trash2,
  Edit,
  Globe,
  Bell,
  Key,
  Database,
  Webhook
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    storeName: 'My Awesome Store',
    storeUrl: 'my-awesome-store.myshopify.com',
    timezone: 'America/New_York',
    autoPublish: true,
    emailFrom: 'reviews@my-awesome-store.com',
    emailReplyTo: 'support@my-awesome-store.com',
    emailSignature: 'Best regards,\nThe My Awesome Store Team',
    utmTracking: true,
    moderationThreshold: 85,
    autoFlag: ['spam', 'fake', 'inappropriate'],
    primaryColor: '#6366F1',
    accentColor: '#10B981'
  });

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@store.com',
      role: 'Admin',
      status: 'active',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@store.com',
      role: 'Marketing',
      status: 'active',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@store.com',
      role: 'Support',
      status: 'inactive',
      lastActive: '1 week ago'
    }
  ];

  const integrations = [
    {
      name: 'Klaviyo',
      description: 'Email marketing automation',
      status: 'connected',
      icon: Mail
    },
    {
      name: 'Shopify Flow',
      description: 'Workflow automation',
      status: 'available',
      icon: Zap
    },
    {
      name: 'Zapier',
      description: 'Connect with 3000+ apps',
      status: 'available',
      icon: Database
    },
    {
      name: 'Webhooks',
      description: 'Custom integrations',
      status: 'configured',
      icon: Webhook
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'configured':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'available':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your TrustLoop configuration</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 w-full max-w-4xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Store Information</span>
              </CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-url">Store URL</Label>
                  <Input
                    id="store-url"
                    value={settings.storeUrl}
                    onChange={(e) => setSettings({...settings, storeUrl: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Auto-publish Reviews</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.autoPublish}
                      onCheckedChange={(checked) => setSettings({...settings, autoPublish: checked})}
                    />
                    <span className="text-sm text-muted-foreground">
                      Automatically publish approved reviews
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Review Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new reviews are submitted</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Moderation Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get alerts for reviews requiring moderation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Configuration</span>
              </CardTitle>
              <CardDescription>Configure email settings for campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-from">From Email</Label>
                  <Input
                    id="email-from"
                    type="email"
                    value={settings.emailFrom}
                    onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-reply">Reply-To Email</Label>
                  <Input
                    id="email-reply"
                    type="email"
                    value={settings.emailReplyTo}
                    onChange={(e) => setSettings({...settings, emailReplyTo: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Textarea
                  id="email-signature"
                  value={settings.emailSignature}
                  onChange={(e) => setSettings({...settings, emailSignature: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>UTM Tracking</Label>
                  <p className="text-sm text-muted-foreground">Add UTM parameters to email links</p>
                </div>
                <Switch
                  checked={settings.utmTracking}
                  onCheckedChange={(checked) => setSettings({...settings, utmTracking: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Widget Appearance</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of your widgets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <Input 
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: settings.accentColor }}
                    />
                    <Input 
                      value={settings.accentColor}
                      onChange={(e) => setSettings({...settings, accentColor: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Review Images</Label>
                    <p className="text-sm text-muted-foreground">Display customer uploaded images</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Support dark mode themes</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mobile Responsive</Label>
                    <p className="text-sm text-muted-foreground">Optimize for mobile devices</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Localization</span>
              </CardTitle>
              <CardDescription>Language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="mm/dd/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>AI Moderation</span>
              </CardTitle>
              <CardDescription>Configure automatic moderation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-approval Threshold: {settings.moderationThreshold}%</Label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.moderationThreshold}
                  onChange={(e) => setSettings({...settings, moderationThreshold: parseInt(e.target.value)})}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Reviews with confidence above this threshold will be automatically approved
                </p>
              </div>
              <div className="space-y-2">
                <Label>Auto-flag Keywords</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {settings.autoFlag.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          autoFlag: settings.autoFlag.filter((_, i) => i !== index)
                        })}
                        className="ml-1 text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input placeholder="Add keyword to auto-flag..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>Connect with third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => {
                  const Icon = integration.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {integration.status === 'connected' || integration.status === 'configured' 
                            ? 'Configure' 
                            : 'Connect'
                          }
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>API Access</span>
              </CardTitle>
              <CardDescription>Manage API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center space-x-2">
                  <Input value="sk_live_••••••••••••••••••••••••••••" readOnly />
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input placeholder="https://your-site.com/webhook" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Billing Information</span>
              </CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Pro Plan</h4>
                  <p className="text-sm text-muted-foreground">$49/month • Next billing: Jan 15, 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Usage This Month</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reviews Processed</span>
                    <span>1,247 / 5,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Members</span>
                  </CardTitle>
                  <CardDescription>Manage team access and permissions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(member.status)}>
                          {member.role}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last active: {member.lastActive}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure what each role can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium border-b pb-2">
                  <div>Permission</div>
                  <div>Admin</div>
                  <div>Marketing</div>
                  <div>Support</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Manage Reviews</div>
                    <div>✓</div>
                    <div>✓</div>
                    <div>✓</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Email Campaigns</div>
                    <div>✓</div>
                    <div>✓</div>
                    <div>—</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Analytics</div>
                    <div>✓</div>
                    <div>✓</div>
                    <div>—</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Settings</div>
                    <div>✓</div>
                    <div>—</div>
                    <div>—</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div>Billing</div>
                    <div>✓</div>
                    <div>—</div>
                    <div>—</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}