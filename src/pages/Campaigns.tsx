import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { 
  Mail, 
  Send, 
  Calendar, 
  Users,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  Upload,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Settings,
  Smartphone,
  Monitor,
  RefreshCw,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

// Types
interface Campaign {
  id: string;
  name: string;
  type: 'review_request' | 'follow_up' | 'thank_you' | 'manual';
  status: 'active' | 'paused' | 'draft' | 'completed';
  template: {
    subject: string;
    content: string;
    previewText: string;
  };
  trigger: {
    event: string;
    delay: number;
    conditions: string[];
  };
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: string;
  lastSent?: string;
  nextRun?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  category: 'review_collection' | 'follow_up' | 'thank_you' | 'custom';
  subject: string;
  content: string;
  previewText: string;
  isDefault: boolean;
  createdAt: string;
}

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Post-Purchase Review Request',
    type: 'review_request',
    status: 'active',
    template: {
      subject: 'How was your recent purchase?',
      content: 'Hi {' + '{first_name}}, we hope you\'re loving your {' + '{product_title}}! Would you mind sharing your experience?',
      previewText: 'Share your experience with {' + '{product_title}}'
    },
    trigger: {
      event: 'order_delivered',
      delay: 3,
      conditions: ['order_value > 25']
    },
    stats: {
      sent: 1247,
      delivered: 1198,
      opened: 456,
      clicked: 123,
      converted: 89
    },
    createdAt: '2024-07-01T10:00:00Z',
    lastSent: '2024-07-15T14:30:00Z',
    nextRun: '2024-07-16T10:00:00Z'
  },
  {
    id: '2',
    name: 'Review Follow-up Reminder',
    type: 'follow_up',
    status: 'active',
    template: {
      subject: 'Quick reminder: Share your thoughts',
      content: 'Hi {' + '{first_name}}, just a friendly reminder to review your {' + '{product_title}}. Your feedback helps other customers!',
      previewText: 'Don\'t forget to review {' + '{product_title}}'
    },
    trigger: {
      event: 'no_review_after_first_email',
      delay: 7,
      conditions: ['first_email_opened']
    },
    stats: {
      sent: 342,
      delivered: 331,
      opened: 145,
      clicked: 67,
      converted: 34
    },
    createdAt: '2024-07-01T10:00:00Z',
    lastSent: '2024-07-14T16:20:00Z',
    nextRun: '2024-07-17T10:00:00Z'
  },
  {
    id: '3',
    name: 'Thank You for Review',
    type: 'thank_you',
    status: 'active',
    template: {
      subject: 'Thank you for your review!',
      content: 'Hi {' + '{first_name}}, thank you for taking the time to review {' + '{product_title}}. Here\'s a 10% discount for your next purchase!',
      previewText: 'Thanks for your review + 10% off your next order'
    },
    trigger: {
      event: 'review_submitted',
      delay: 0,
      conditions: ['rating >= 4']
    },
    stats: {
      sent: 89,
      delivered: 87,
      opened: 72,
      clicked: 45,
      converted: 23
    },
    createdAt: '2024-07-01T10:00:00Z',
    lastSent: '2024-07-15T11:45:00Z'
  },
  {
    id: '4',
    name: 'VIP Customer Outreach',
    type: 'manual',
    status: 'draft',
    template: {
      subject: 'Exclusive preview for our VIP customers',
      content: 'Hi {' + '{first_name}}, as one of our valued customers, we\'d love to get your early feedback on our new products.',
      previewText: 'Exclusive VIP preview and feedback request'
    },
    trigger: {
      event: 'manual',
      delay: 0,
      conditions: ['customer_tier = vip']
    },
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    },
    createdAt: '2024-07-10T15:00:00Z'
  }
];

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Modern Review Request',
    category: 'review_collection',
    subject: 'How was your {' + '{product_title}}?',
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi ${'{{first_name}}'}!</h2>
      <p>We hope you're loving your recent purchase of ${'{{product_title}}'}.</p>
      <p>Would you mind taking a moment to share your experience? Your feedback helps other customers make informed decisions.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${'{{review_url}}'}" style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Write a Review</a>
      </div>
      <p>Thank you for choosing ${'{{shop_name}}'}!</p>
    </div>`,
    previewText: 'Share your experience with {' + '{product_title}}',
    isDefault: true,
    createdAt: '2024-07-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Friendly Follow-up',
    category: 'follow_up',
    subject: 'Just checking in about your {' + '{product_title}}',
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hi ${'{{first_name}}'}!</h2>
      <p>Just a friendly reminder about reviewing your ${'{{product_title}}'}.</p>
      <p>We'd love to hear about your experience - it only takes a minute!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${'{{review_url}}'}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Leave a Review</a>
      </div>
    </div>`,
    previewText: 'Quick reminder to review {' + '{product_title}}',
    isDefault: true,
    createdAt: '2024-07-01T10:00:00Z'
  }
];

const CampaignCard = ({ 
  campaign, 
  onStatusChange, 
  onEdit, 
  onDuplicate,
  onDelete,
  onView 
}: { 
  campaign: Campaign; 
  onStatusChange: (id: string, status: Campaign['status']) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (campaign: Campaign) => void;
}) => {
  const openRate = campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent * 100) : 0;
  const clickRate = campaign.stats.opened > 0 ? (campaign.stats.clicked / campaign.stats.opened * 100) : 0;
  const conversionRate = campaign.stats.sent > 0 ? (campaign.stats.converted / campaign.stats.sent * 100) : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">{campaign.name}</h3>
              <Badge 
                variant={
                  campaign.status === 'active' ? 'default' : 
                  campaign.status === 'paused' ? 'secondary' : 
                  campaign.status === 'draft' ? 'outline' : 'destructive'
                }
                className="text-xs"
              >
                {campaign.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {campaign.type.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {campaign.template.subject}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-lg font-semibold">{campaign.stats.sent.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">{openRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Open Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">{clickRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Click Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600">{conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
            </div>

            {/* Trigger Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Trigger: {campaign.trigger.event.replace('_', ' ')}</span>
              {campaign.trigger.delay > 0 && (
                <span>Delay: {campaign.trigger.delay} days</span>
              )}
              {campaign.lastSent && (
                <span>Last sent: {new Date(campaign.lastSent).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(campaign)}>
                <Eye size={14} className="mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(campaign.id)}>
                <Edit size={14} className="mr-2" />
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {campaign.status === 'active' ? (
                <DropdownMenuItem onClick={() => onStatusChange(campaign.id, 'paused')}>
                  <Pause size={14} className="mr-2" />
                  Pause
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onStatusChange(campaign.id, 'active')}>
                  <Play size={14} className="mr-2" />
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDuplicate(campaign.id)}>
                <Copy size={14} className="mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(campaign.id)} className="text-destructive">
                <Trash2 size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bars for key metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Delivery Rate</span>
            <span>{campaign.stats.sent > 0 ? ((campaign.stats.delivered / campaign.stats.sent) * 100).toFixed(1) : 0}%</span>
          </div>
          <Progress 
            value={campaign.stats.sent > 0 ? (campaign.stats.delivered / campaign.stats.sent) * 100 : 0} 
            className="h-1" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignDetailModal = ({ 
  campaign, 
  isOpen, 
  onClose 
}: { 
  campaign: Campaign | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!campaign) return null;

  const openRate = campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent * 100) : 0;
  const clickRate = campaign.stats.opened > 0 ? (campaign.stats.clicked / campaign.stats.opened * 100) : 0;
  const conversionRate = campaign.stats.sent > 0 ? (campaign.stats.converted / campaign.stats.sent * 100) : 0;
  const deliveryRate = campaign.stats.sent > 0 ? (campaign.stats.delivered / campaign.stats.sent * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{campaign.name}</DialogTitle>
          <DialogDescription>
            Campaign performance and details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Campaign Status */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge 
                variant={
                  campaign.status === 'active' ? 'default' : 
                  campaign.status === 'paused' ? 'secondary' : 
                  campaign.status === 'draft' ? 'outline' : 'destructive'
                }
              >
                {campaign.status}
              </Badge>
              <Badge variant="outline">
                {campaign.type.replace('_', ' ')}
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
              {campaign.lastSent && (
                <p>Last sent: {new Date(campaign.lastSent).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{campaign.stats.sent.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Sent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{deliveryRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-xs text-muted-foreground">{campaign.stats.delivered.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{openRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-xs text-muted-foreground">{campaign.stats.opened.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <p className="text-xs text-muted-foreground">{campaign.stats.converted.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Email Template Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Email Template</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Subject Line</Label>
                  <p className="font-medium">{campaign.template.subject}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Preview Text</Label>
                  <p className="text-sm text-muted-foreground">{campaign.template.previewText}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Content Preview</Label>
                  <div className="p-3 bg-muted rounded text-sm">
                    {campaign.template.content.substring(0, 200)}...
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Trigger Settings</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Event</Label>
                  <p className="font-medium">{campaign.trigger.event.replace('_', ' ')}</p>
                </div>
                {campaign.trigger.delay > 0 && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Delay</Label>
                    <p className="font-medium">{campaign.trigger.delay} days after event</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Conditions</Label>
                  <div className="space-y-1">
                    {campaign.trigger.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div>
            <h4 className="font-medium mb-3">Performance Over Time</h4>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                <p>Performance chart would appear here</p>
                <p className="text-sm">Showing opens, clicks, and conversions over time</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CreateCampaignModal = ({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (campaign: Partial<Campaign>) => void;
}) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    type: 'review_request' as Campaign['type'],
    subject: '',
    content: '',
    previewText: '',
    triggerEvent: 'order_delivered',
    triggerDelay: 3,
    conditions: ['']
  });

  const handleSave = () => {
    if (!campaignData.name || !campaignData.subject || !campaignData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave({
      name: campaignData.name,
      type: campaignData.type,
      status: 'draft',
      template: {
        subject: campaignData.subject,
        content: campaignData.content,
        previewText: campaignData.previewText
      },
      trigger: {
        event: campaignData.triggerEvent,
        delay: campaignData.triggerDelay,
        conditions: campaignData.conditions.filter(c => c.trim())
      }
    });

    // Reset form
    setCampaignData({
      name: '',
      type: 'review_request',
      subject: '',
      content: '',
      previewText: '',
      triggerEvent: 'order_delivered',
      triggerDelay: 3,
      conditions: ['']
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up an automated email campaign to engage with your customers
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Post-Purchase Review Request"
              />
            </div>

            <div>
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select 
                value={campaignData.type} 
                onValueChange={(value: Campaign['type']) => setCampaignData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review_request">Review Request</SelectItem>
                  <SelectItem value="follow_up">Follow-up Reminder</SelectItem>
                  <SelectItem value="thank_you">Thank You</SelectItem>
                  <SelectItem value="manual">Manual Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Email Template</h4>
            
            <div>
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                value={campaignData.subject}
                onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder={'How was your {{product_title}}?'}
              />
            </div>

            <div>
              <Label htmlFor="preview-text">Preview Text</Label>
              <Input
                id="preview-text"
                value={campaignData.previewText}
                onChange={(e) => setCampaignData(prev => ({ ...prev, previewText: e.target.value }))}
                placeholder="Share your experience with {{product_title}}"
              />
            </div>

            <div>
              <Label htmlFor="content">Email Content *</Label>
              <Textarea
                id="content"
                value={campaignData.content}
                onChange={(e) => setCampaignData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Hi {{first_name}}, we hope you're loving your {{product_title}}..."
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variables like <code>{'{{first_name}}'}</code>, <code>{'{{product_title}}'}</code>, <code>{'{{shop_name}}'}</code>, <code>{'{{review_url}}'}</code>
              </p>
            </div>
          </div>

          {/* Trigger Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Trigger Settings</h4>
            
            <div>
              <Label htmlFor="trigger-event">Trigger Event</Label>
              <Select 
                value={campaignData.triggerEvent} 
                onValueChange={(value) => setCampaignData(prev => ({ ...prev, triggerEvent: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_delivered">Order Delivered</SelectItem>
                  <SelectItem value="order_completed">Order Completed</SelectItem>
                  <SelectItem value="no_review_after_first_email">No Review After First Email</SelectItem>
                  <SelectItem value="review_submitted">Review Submitted</SelectItem>
                  <SelectItem value="manual">Manual Trigger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {campaignData.triggerEvent !== 'manual' && (
              <div>
                <Label htmlFor="trigger-delay">Delay (days)</Label>
                <Input
                  id="trigger-delay"
                  type="number"
                  value={campaignData.triggerDelay}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, triggerDelay: parseInt(e.target.value) || 0 }))}
                  min="0"
                  max="30"
                />
              </div>
            )}

            <div>
              <Label htmlFor="conditions">Conditions (optional)</Label>
              <Input
                id="conditions"
                value={campaignData.conditions[0]}
                onChange={(e) => setCampaignData(prev => ({ ...prev, conditions: [e.target.value] }))}
                placeholder="e.g., order_value > 25"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Create Campaign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('created');

  useEffect(() => {
    let filtered = campaigns;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign => 
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.template.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === selectedType);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'performance':
          const aConversion = a.stats.sent > 0 ? (a.stats.converted / a.stats.sent) : 0;
          const bConversion = b.stats.sent > 0 ? (b.stats.converted / b.stats.sent) : 0;
          return bConversion - aConversion;
        case 'sent':
          return b.stats.sent - a.stats.sent;
        default:
          return 0;
      }
    });

    setFilteredCampaigns(filtered);
  }, [campaigns, searchQuery, selectedStatus, selectedType, sortBy]);

  const handleStatusChange = (id: string, status: Campaign['status']) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id ? { ...campaign, status } : campaign
      )
    );
    toast.success(`Campaign ${status === 'active' ? 'activated' : status === 'paused' ? 'paused' : 'updated'}`);
  };

  const handleCreateCampaign = (campaignData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignData.name!,
      type: campaignData.type!,
      status: campaignData.status!,
      template: campaignData.template!,
      trigger: campaignData.trigger!,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    toast.success('Campaign created successfully');
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (id: string) => {
    toast.info('Edit functionality would open campaign editor');
  };

  const handleDuplicate = (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      const duplicated: Campaign = {
        ...campaign,
        id: Date.now().toString(),
        name: `${campaign.name} (Copy)`,
        status: 'draft',
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0
        },
        createdAt: new Date().toISOString(),
        lastSent: undefined,
        nextRun: undefined
      };
      setCampaigns(prev => [duplicated, ...prev]);
      toast.success('Campaign duplicated');
    }
  };

  const handleDelete = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success('Campaign deleted');
  };

  const totalStats = campaigns.reduce((acc, campaign) => ({
    sent: acc.sent + campaign.stats.sent,
    delivered: acc.delivered + campaign.stats.delivered,
    opened: acc.opened + campaign.stats.opened,
    clicked: acc.clicked + campaign.stats.clicked,
    converted: acc.converted + campaign.stats.converted
  }), { sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 });

  const avgOpenRate = totalStats.sent > 0 ? (totalStats.opened / totalStats.sent * 100) : 0;
  const avgClickRate = totalStats.opened > 0 ? (totalStats.clicked / totalStats.opened * 100) : 0;
  const avgConversionRate = totalStats.sent > 0 ? (totalStats.converted / totalStats.sent * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Campaigns</h2>
          <p className="text-muted-foreground">
            Automate your review collection and customer engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} className="mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">{totalStats.sent.toLocaleString()}</p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold text-blue-600">{avgOpenRate.toFixed(1)}%</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Click Rate</p>
                <p className="text-2xl font-bold text-green-600">{avgClickRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="review_request">Review Request</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="thank_you">Thank You</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Date Created</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="sent">Emails Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onView={handleViewDetails}
              />
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Mail size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'Create your first email campaign to start engaging customers.'}
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {template.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium mb-2">{template.subject}</p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {template.previewText}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Overall email campaign metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Performance chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Engagement</CardTitle>
                <CardDescription>Open and click rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Engagement chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Campaign Detail Modal */}
      <CampaignDetailModal
        campaign={selectedCampaign}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCampaign}
      />
    </div>
  );
}