import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Star, 
  MessageSquare, 
  Calendar, 
  ShoppingBag,
  MoreHorizontal,
  Check,
  X,
  Flag,
  Eye,
  Reply,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Plus,
  SortAsc,
  BarChart3,
  RefreshCw,
  Archive,
  Clock
} from 'lucide-react';
import { useShopify } from '../hooks/useShopify';
import { toast } from 'sonner';

// Types
interface Review {
  id: string;
  customer: {
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
  product: {
    id: string;
    title: string;
    image?: string;
  };
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  status: 'published' | 'pending' | 'rejected';
  source: 'widget' | 'email' | 'import';
  helpful: number;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  tags: string[];
  reply?: {
    content: string;
    author: string;
    createdAt: string;
  };
}

// Mock data
const mockReviews: Review[] = [];

const ProductFilterSelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="All Products" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Products</SelectItem>
      <SelectItem value="prod_1">Wireless Bluetooth Headphones</SelectItem>
      <SelectItem value="prod_2">Smart Fitness Watch</SelectItem>
      <SelectItem value="prod_3">Gaming Mouse</SelectItem>
    </SelectContent>
  </Select>
);

const StatusFilter = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="published">Published</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="rejected">Rejected</SelectItem>
    </SelectContent>
  </Select>
);

const RatingFilter = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Rating" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Ratings</SelectItem>
      <SelectItem value="5">5 Stars</SelectItem>
      <SelectItem value="4">4 Stars</SelectItem>
      <SelectItem value="3">3 Stars</SelectItem>
      <SelectItem value="2">2 Stars</SelectItem>
      <SelectItem value="1">1 Star</SelectItem>
    </SelectContent>
  </Select>
);

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}
      />
    ))}
  </div>
);

const ReviewCard = ({ 
  review, 
  onStatusChange, 
  onReply, 
  onView 
}: { 
  review: Review; 
  onStatusChange: (id: string, status: Review['status']) => void;
  onReply: (id: string) => void;
  onView: (review: Review) => void;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.customer.avatar} />
          <AvatarFallback>
            {review.customer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.customer.name}</span>
                {review.customer.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check size={10} className="mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge 
                  variant={review.status === 'published' ? 'default' : review.status === 'pending' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {review.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{review.product.title}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(review)}>
                  <Eye size={14} className="mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReply(review.id)}>
                  <Reply size={14} className="mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onStatusChange(review.id, 'published')}>
                  <Check size={14} className="mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(review.id, 'rejected')}>
                  <X size={14} className="mr-2" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(review.id, 'pending')}>
                  <Flag size={14} className="mr-2" />
                  Flag for Review
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
            <StarRating rating={review.rating} />
            <span className="text-sm text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="font-medium mb-1">{review.title}</h4>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{review.content}</p>
          
          {review.media.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.media.map((media, index) => (
                <div key={index} className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  {media.type === 'image' ? (
                    <ImageIcon size={16} className="text-muted-foreground" />
                  ) : (
                    <Video size={16} className="text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {review.tags.length > 0 && (
            <div className="flex gap-1 mb-3 flex-wrap">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{review.helpful} found helpful</span>
            <div className="flex items-center gap-2">
              <span>Source: {review.source}</span>
              {review.reply && (
                <Badge variant="secondary" className="text-xs">
                  Replied
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ReviewDetailModal = ({ 
  review, 
  isOpen, 
  onClose 
}: { 
  review: Review | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
          <DialogDescription>
            Complete review information and management options
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={review.customer.avatar} />
              <AvatarFallback>
                {review.customer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.customer.name}</span>
                {review.customer.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check size={10} className="mr-1" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{review.customer.email}</p>
              <p className="text-xs text-muted-foreground">
                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            {review.product.image && (
              <img 
                src={review.product.image} 
                alt={review.product.title}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium">{review.product.title}</p>
              <Button variant="link" className="p-0 h-auto text-xs">
                <ExternalLink size={12} className="mr-1" />
                View Product
              </Button>
            </div>
          </div>

          {/* Rating & Review */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={review.rating} size={20} />
              <span className="font-medium text-lg">{review.rating}/5</span>
            </div>
            <h3 className="font-semibold mb-2">{review.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{review.content}</p>
          </div>

          {/* Media */}
          {review.media.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Attached Media</h4>
              <div className="grid grid-cols-3 gap-3">
                {review.media.map((media, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    {media.type === 'image' ? (
                      <ImageIcon size={24} className="text-muted-foreground" />
                    ) : (
                      <Video size={24} className="text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply */}
          {review.reply ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Reply from {review.reply.author}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm">{review.reply.content}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium">Reply to Review</h4>
              <Textarea placeholder="Write your reply..." />
              <div className="flex gap-2">
                <Button size="sm">Send Reply</Button>
                <Button variant="outline" size="sm">Save Draft</Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Flag size={14} className="mr-2" />
                Flag
              </Button>
              <Button variant="outline" size="sm">
                <Archive size={14} className="mr-2" />
                Archive
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <X size={14} className="mr-2" />
                Reject
              </Button>
              <Button size="sm">
                <Check size={14} className="mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Reviews() {
  const { authenticatedFetch } = useShopify();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let filtered = reviews;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Product filter
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(review => review.product.id === selectedProduct);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(review => review.status === selectedStatus);
    }

    // Rating filter
    if (selectedRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating));
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, selectedProduct, selectedStatus, selectedRating, sortBy]);

  const handleStatusChange = (id: string, status: Review['status']) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id ? { ...review, status } : review
      )
    );
    toast.success(`Review ${status === 'published' ? 'approved' : status === 'rejected' ? 'rejected' : 'flagged'}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedReviews.length === 0) {
      toast.error('Please select reviews first');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (action === 'approve') {
        setReviews(prev => 
          prev.map(review => 
            selectedReviews.includes(review.id) ? { ...review, status: 'published' as const } : review
          )
        );
        toast.success(`${selectedReviews.length} reviews approved`);
      } else if (action === 'reject') {
        setReviews(prev => 
          prev.map(review => 
            selectedReviews.includes(review.id) ? { ...review, status: 'rejected' as const } : review
          )
        );
        toast.success(`${selectedReviews.length} reviews rejected`);
      }
      
      setSelectedReviews([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleReply = (id: string) => {
    const review = reviews.find(r => r.id === id);
    if (review) {
      setSelectedReview(review);
      setIsDetailModalOpen(true);
    }
  };

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.status === 'published').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    avgRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews Manager</h2>
          <p className="text-muted-foreground">
            Manage customer reviews, moderate content, and engage with your community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Import Reviews
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
              <Check className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
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
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search reviews by customer, product, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <ProductFilterSelect value={selectedProduct} onChange={setSelectedProduct} />
              <StatusFilter value={selectedStatus} onChange={setSelectedStatus} />
              <RatingFilter value={selectedRating} onChange={setSelectedRating} />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SortAsc size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="helpful">Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedReviews.length} review{selectedReviews.length === 1 ? '' : 's'} selected
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
                  onClick={() => setSelectedReviews([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="flex items-start gap-3">
            <Checkbox
              checked={selectedReviews.includes(review.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedReviews(prev => [...prev, review.id]);
                } else {
                  setSelectedReviews(prev => prev.filter(id => id !== review.id));
                }
              }}
              className="mt-4"
            />
            <div className="flex-1">
              <ReviewCard
                review={review}
                onStatusChange={handleStatusChange}
                onReply={handleReply}
                onView={handleViewDetails}
              />
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No reviews found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedProduct !== 'all' || selectedStatus !== 'all' || selectedRating !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Start collecting reviews to see them here.'
              }
            </p>
            <Button variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}