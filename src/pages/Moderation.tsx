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
import { Checkbox } from '../components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { 
  Search, 
  Filter, 
  Shield, 
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Check,
  X,
  Flag,
  Eye,
  Zap,
  Settings,
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  Globe,
  RefreshCw,
  Archive,
  Bot,
  User,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

// Types
interface ModerationItem {
  id: string;
  type: 'review' | 'question' | 'answer';
  content: {
    title?: string;
    text: string;
    rating?: number;
  };
  author: {
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
  product?: {
    id: string;
    title: string;
    image?: string;
  };
  aiAnalysis: {
    spamScore: number;
    sentimentScore: number;
    toxicityScore: number;
    languageDetected: string;
    suggestedAction: 'approve' | 'flag' | 'reject';
    confidence: number;
    flags: string[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

interface ModerationSettings {
  autoApproveThreshold: number;
  autoRejectThreshold: number;
  enableSpamDetection: boolean;
  enableSentimentAnalysis: boolean;
  enableToxicityFilter: boolean;
  enableLanguageDetection: boolean;
  bannedWords: string[];
  trustedDomains: string[];
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: boolean;
  };
}

// Mock data
const mockModerationItems: ModerationItem[] = [
  {
    id: '1',
    type: 'review',
    content: {
      title: 'Amazing product!',
      text: 'This is the best headphones I\'ve ever used. The sound quality is incredible and the battery lasts forever!',
      rating: 5
    },
    author: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    product: {
      id: 'prod_1',
      title: 'Wireless Bluetooth Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    aiAnalysis: {
      spamScore: 15,
      sentimentScore: 92,
      toxicityScore: 5,
      languageDetected: 'en',
      suggestedAction: 'approve',
      confidence: 95,
      flags: []
    },
    status: 'pending',
    createdAt: '2024-07-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'review',
    content: {
      title: 'Terrible quality',
      text: 'This product is absolute garbage. Don\'t waste your money on this piece of junk. The company is a scam!',
      rating: 1
    },
    author: {
      name: 'Anonymous User',
      email: 'temp@tempmail.com',
      verified: false
    },
    product: {
      id: 'prod_1',
      title: 'Wireless Bluetooth Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    aiAnalysis: {
      spamScore: 78,
      sentimentScore: 8,
      toxicityScore: 85,
      languageDetected: 'en',
      suggestedAction: 'flag',
      confidence: 87,
      flags: ['potential_spam', 'high_toxicity', 'unverified_email']
    },
    status: 'pending',
    createdAt: '2024-07-14T16:45:00Z'
  },
  {
    id: '3',
    type: 'question',
    content: {
      text: 'What is the warranty period for this product?'
    },
    author: {
      name: 'Mike Chen',
      email: 'mike@example.com',
      verified: true
    },
    product: {
      id: 'prod_2',
      title: 'Smart Fitness Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    },
    aiAnalysis: {
      spamScore: 5,
      sentimentScore: 65,
      toxicityScore: 2,
      languageDetected: 'en',
      suggestedAction: 'approve',
      confidence: 98,
      flags: []
    },
    status: 'approved',
    createdAt: '2024-07-13T09:15:00Z',
    moderatedAt: '2024-07-13T09:20:00Z',
    moderatedBy: 'AI Auto-Moderator'
  }
];

const mockSettings: ModerationSettings = {
  autoApproveThreshold: 85,
  autoRejectThreshold: 20,
  enableSpamDetection: true,
  enableSentimentAnalysis: true,
  enableToxicityFilter: true,
  enableLanguageDetection: true,
  bannedWords: ['spam', 'scam', 'fake', 'garbage'],
  trustedDomains: ['gmail.com', 'yahoo.com', 'outlook.com'],
  notifications: {
    email: true,
    slack: false,
    webhook: false
  }
};

const ModerationCard = ({ 
  item, 
  onStatusChange, 
  onView 
}: { 
  item: ModerationItem; 
  onStatusChange: (id: string, status: ModerationItem['status']) => void;
  onView: (item: ModerationItem) => void;
}) => {
  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      item.status === 'approved' && "border-green-200 bg-green-50/30",
      item.status === 'rejected' && "border-red-200 bg-red-50/30",
      item.status === 'flagged' && "border-yellow-200 bg-yellow-50/30"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={item.author.avatar} />
            <AvatarFallback>
              {item.author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.author.name}</span>
                  {item.author.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Check size={10} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge 
                    variant={
                      item.status === 'approved' ? 'default' : 
                      item.status === 'rejected' ? 'destructive' : 
                      item.status === 'flagged' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                {item.product && (
                  <p className="text-sm text-muted-foreground">{item.product.title}</p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(item)}>
                    <Eye size={14} className="mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onStatusChange(item.id, 'approved')}>
                    <Check size={14} className="mr-2" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(item.id, 'flagged')}>
                    <Flag size={14} className="mr-2" />
                    Flag for Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(item.id, 'rejected')}>
                    <X size={14} className="mr-2" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Archive size={14} className="mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              {item.content.rating && (
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < item.content.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted"}
                    />
                  ))}
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {item.content.title && (
              <h4 className="font-medium mb-1">{item.content.title}</h4>
            )}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.content.text}</p>
            
            {/* AI Analysis */}
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} className="text-primary" />
                <span className="text-xs font-medium">AI Analysis</span>
                <Badge variant="outline" className="text-xs">
                  {item.aiAnalysis.confidence}% confidence
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Spam</p>
                  <p className={cn("text-sm font-medium", item.aiAnalysis.spamScore > 50 ? "text-red-600" : "text-green-600")}>
                    {item.aiAnalysis.spamScore}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <p className={cn("text-sm font-medium", getSentimentColor(item.aiAnalysis.sentimentScore))}>
                    {item.aiAnalysis.sentimentScore}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Toxicity</p>
                  <p className={cn("text-sm font-medium", item.aiAnalysis.toxicityScore > 50 ? "text-red-600" : "text-green-600")}>
                    {item.aiAnalysis.toxicityScore}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Suggested:</span>
                  <Badge 
                    variant={
                      item.aiAnalysis.suggestedAction === 'approve' ? 'default' : 
                      item.aiAnalysis.suggestedAction === 'reject' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {item.aiAnalysis.suggestedAction}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Globe size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.aiAnalysis.languageDetected}</span>
                </div>
              </div>
              
              {item.aiAnalysis.flags.length > 0 && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {item.aiAnalysis.flags.map((flag) => (
                    <Badge key={flag} variant="outline" className="text-xs text-orange-600">
                      <AlertTriangle size={10} className="mr-1" />
                      {flag.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {item.moderatedAt && (
              <div className="text-xs text-muted-foreground">
                Moderated by {item.moderatedBy} on {new Date(item.moderatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ModerationSettings = ({ 
  settings, 
  onSettingsChange 
}: { 
  settings: ModerationSettings;
  onSettingsChange: (settings: ModerationSettings) => void;
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    toast.success('Moderation settings updated');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Moderation Settings</CardTitle>
          <CardDescription>
            Configure automatic moderation thresholds and rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-moderation thresholds */}
          <div className="space-y-4">
            <h4 className="font-medium">Auto-moderation Thresholds</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Auto-approve threshold</Label>
                  <span className="text-sm text-muted-foreground">{localSettings.autoApproveThreshold}%</span>
                </div>
                <Slider
                  value={[localSettings.autoApproveThreshold]}
                  onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, autoApproveThreshold: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Content with confidence above this threshold will be auto-approved
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Auto-reject threshold</Label>
                  <span className="text-sm text-muted-foreground">{localSettings.autoRejectThreshold}%</span>
                </div>
                <Slider
                  value={[localSettings.autoRejectThreshold]}
                  onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, autoRejectThreshold: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Content with spam/toxicity above this threshold will be auto-rejected
                </p>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="space-y-4">
            <h4 className="font-medium">AI Analysis Features</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Spam Detection</Label>
                  <p className="text-xs text-muted-foreground">Detect and filter spam content</p>
                </div>
                <Switch
                  checked={localSettings.enableSpamDetection}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, enableSpamDetection: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sentiment Analysis</Label>
                  <p className="text-xs text-muted-foreground">Analyze emotional tone of content</p>
                </div>
                <Switch
                  checked={localSettings.enableSentimentAnalysis}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, enableSentimentAnalysis: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Toxicity Filter</Label>
                  <p className="text-xs text-muted-foreground">Filter toxic and harmful content</p>
                </div>
                <Switch
                  checked={localSettings.enableToxicityFilter}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, enableToxicityFilter: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Language Detection</Label>
                  <p className="text-xs text-muted-foreground">Detect and translate content language</p>
                </div>
                <Switch
                  checked={localSettings.enableLanguageDetection}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, enableLanguageDetection: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Banned Words */}
          <div className="space-y-3">
            <h4 className="font-medium">Banned Words</h4>
            <Textarea
              value={localSettings.bannedWords.join(', ')}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                bannedWords: e.target.value.split(',').map(word => word.trim()).filter(Boolean)
              }))}
              placeholder="Enter banned words separated by commas"
              rows={3}
            />
          </div>

          {/* Trusted Domains */}
          <div className="space-y-3">
            <h4 className="font-medium">Trusted Email Domains</h4>
            <Textarea
              value={localSettings.trustedDomains.join(', ')}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                trustedDomains: e.target.value.split(',').map(domain => domain.trim()).filter(Boolean)
              }))}
              placeholder="Enter trusted domains separated by commas"
              rows={2}
            />
          </div>

          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Moderation() {
  const [items, setItems] = useState<ModerationItem[]>(mockModerationItems);
  const [settings, setSettings] = useState<ModerationSettings>(mockSettings);
  const [filteredItems, setFilteredItems] = useState<ModerationItem[]>(mockModerationItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedConfidence, setSelectedConfidence] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content.title && item.content.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Confidence filter
    if (selectedConfidence !== 'all') {
      const threshold = parseInt(selectedConfidence);
      filtered = filtered.filter(item => item.aiAnalysis.confidence >= threshold);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'confidence':
          return b.aiAnalysis.confidence - a.aiAnalysis.confidence;
        case 'spam':
          return b.aiAnalysis.spamScore - a.aiAnalysis.spamScore;
        case 'toxicity':
          return b.aiAnalysis.toxicityScore - a.aiAnalysis.toxicityScore;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedStatus, selectedType, selectedConfidence, sortBy]);

  const handleStatusChange = (id: string, status: ModerationItem['status']) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item, 
          status, 
          moderatedAt: new Date().toISOString(),
          moderatedBy: 'Manual Review'
        } : item
      )
    );
    toast.success(`Item ${status}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (action === 'approve') {
        setItems(prev => 
          prev.map(item => 
            selectedItems.includes(item.id) ? { 
              ...item, 
              status: 'approved' as const,
              moderatedAt: new Date().toISOString(),
              moderatedBy: 'Bulk Action'
            } : item
          )
        );
        toast.success(`${selectedItems.length} items approved`);
      } else if (action === 'reject') {
        setItems(prev => 
          prev.map(item => 
            selectedItems.includes(item.id) ? { 
              ...item, 
              status: 'rejected' as const,
              moderatedAt: new Date().toISOString(),
              moderatedBy: 'Bulk Action'
            } : item
          )
        );
        toast.success(`${selectedItems.length} items rejected`);
      }
      
      setSelectedItems([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleViewDetails = (item: ModerationItem) => {
    toast.info('Item details would open in modal');
  };

  const stats = {
    total: items.length,
    pending: items.filter(item => item.status === 'pending').length,
    approved: items.filter(item => item.status === 'approved').length,
    rejected: items.filter(item => item.status === 'rejected').length,
    flagged: items.filter(item => item.status === 'flagged').length,
    avgConfidence: items.reduce((acc, item) => acc + item.aiAnalysis.confidence, 0) / items.length,
    highRisk: items.filter(item => item.aiAnalysis.spamScore > 70 || item.aiAnalysis.toxicityScore > 70).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Moderation</h2>
          <p className="text-muted-foreground">
            Intelligent content moderation with AI-powered analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-2xl font-bold">{stats.avgConfidence.toFixed(0)}%</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{stats.highRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-processed</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList>
          <TabsTrigger value="queue">Moderation Queue</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search content, authors, or products..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="review">Reviews</SelectItem>
                      <SelectItem value="question">Questions</SelectItem>
                      <SelectItem value="answer">Answers</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Confidence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Confidence</SelectItem>
                      <SelectItem value="90">90%+ High</SelectItem>
                      <SelectItem value="70">70%+ Medium</SelectItem>
                      <SelectItem value="50">50%+ Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="confidence">Confidence</SelectItem>
                      <SelectItem value="spam">Spam Score</SelectItem>
                      <SelectItem value="toxicity">Toxicity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'} selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction('approve')}
                      disabled={isLoading}
                    >
                      {isLoading ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <Check size={14} className="mr-2" />}
                      Approve All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction('reject')}
                      disabled={isLoading}
                    >
                      <X size={14} className="mr-2" />
                      Reject All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedItems([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moderation Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems(prev => [...prev, item.id]);
                    } else {
                      setSelectedItems(prev => prev.filter(id => id !== item.id));
                    }
                  }}
                  className="mt-4"
                />
                <div className="flex-1">
                  <ModerationCard
                    item={item}
                    onStatusChange={handleStatusChange}
                    onView={handleViewDetails}
                  />
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Shield size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'All content has been moderated.'}
                </p>
                <Button variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ModerationSettings 
            settings={settings}
            onSettingsChange={setSettings}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Performance</CardTitle>
                <CardDescription>AI accuracy and processing metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Performance analytics would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Analysis</CardTitle>
                <CardDescription>Spam, sentiment, and toxicity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Content analysis chart would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}