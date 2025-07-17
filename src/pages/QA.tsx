import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Calendar, 
  ShoppingBag,
  MoreHorizontal,
  Check,
  X,
  Flag,
  Eye,
  Reply,
  Pin,
  Archive,
  Plus,
  SortAsc,
  RefreshCw,
  HelpCircle,
  User,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

// Types
interface Question {
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
  question: string;
  createdAt: string;
  status: 'published' | 'pending' | 'rejected';
  category: string;
  helpful: number;
  notHelpful: number;
  isPinned: boolean;
  answers: Answer[];
}

interface Answer {
  id: string;
  author: {
    name: string;
    type: 'customer' | 'admin';
    avatar?: string;
  };
  content: string;
  createdAt: string;
  helpful: number;
  notHelpful: number;
  isAccepted: boolean;
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: '1',
    customer: {
      name: 'Alex Thompson',
      email: 'alex@example.com',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    product: {
      id: 'prod_1',
      title: 'Wireless Bluetooth Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    question: 'How long does the battery last on a single charge?',
    createdAt: '2024-07-15T10:30:00Z',
    status: 'published',
    category: 'Battery Life',
    helpful: 15,
    notHelpful: 2,
    isPinned: true,
    answers: [
      {
        id: 'ans_1',
        author: {
          name: 'Store Admin',
          type: 'admin'
        },
        content: 'The battery lasts up to 30 hours on a single charge with ANC off, and about 20 hours with ANC on.',
        createdAt: '2024-07-15T11:00:00Z',
        helpful: 12,
        notHelpful: 0,
        isAccepted: true
      },
      {
        id: 'ans_2',
        author: {
          name: 'Sarah M.',
          type: 'customer',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
        },
        content: 'I get about 25-28 hours in my daily use. Really impressed with the battery life!',
        createdAt: '2024-07-15T14:20:00Z',
        helpful: 8,
        notHelpful: 1,
        isAccepted: false
      }
    ]
  },
  {
    id: '2',
    customer: {
      name: 'Maria Garcia',
      email: 'maria@example.com',
      verified: false
    },
    product: {
      id: 'prod_2',
      title: 'Smart Fitness Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    },
    question: 'Is this watch waterproof? Can I swim with it?',
    createdAt: '2024-07-14T16:45:00Z',
    status: 'published',
    category: 'Water Resistance',
    helpful: 8,
    notHelpful: 0,
    isPinned: false,
    answers: [
      {
        id: 'ans_3',
        author: {
          name: 'Store Admin',
          type: 'admin'
        },
        content: 'Yes, it has 5ATM water resistance rating, so it\'s safe for swimming and showering.',
        createdAt: '2024-07-14T17:00:00Z',
        helpful: 6,
        notHelpful: 0,
        isAccepted: true
      }
    ]
  },
  {
    id: '3',
    customer: {
      name: 'John Davis',
      email: 'john@example.com',
      verified: true
    },
    product: {
      id: 'prod_1',
      title: 'Wireless Bluetooth Headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    },
    question: 'What\'s the warranty period for these headphones?',
    createdAt: '2024-07-13T09:15:00Z',
    status: 'pending',
    category: 'Warranty',
    helpful: 3,
    notHelpful: 0,
    isPinned: false,
    answers: []
  }
];

const categories = [
  'All Categories',
  'Battery Life',
  'Water Resistance', 
  'Warranty',
  'Compatibility',
  'Size & Fit',
  'Shipping',
  'Returns'
];

const QuestionCard = ({ 
  question, 
  onStatusChange, 
  onAnswer, 
  onPin,
  onView 
}: { 
  question: Question; 
  onStatusChange: (id: string, status: Question['status']) => void;
  onAnswer: (id: string) => void;
  onPin: (id: string) => void;
  onView: (question: Question) => void;
}) => (
  <Card className={cn("hover:shadow-md transition-shadow", question.isPinned && "border-primary/50 bg-primary/5")}>
    <CardContent className="p-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={question.customer.avatar} />
          <AvatarFallback>
            {question.customer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{question.customer.name}</span>
                {question.customer.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Check size={10} className="mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge 
                  variant={question.status === 'published' ? 'default' : question.status === 'pending' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {question.status}
                </Badge>
                {question.isPinned && (
                  <Badge variant="outline" className="text-xs text-primary">
                    <Pin size={10} className="mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{question.product.title}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(question)}>
                  <Eye size={14} className="mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAnswer(question.id)}>
                  <Reply size={14} className="mr-2" />
                  Answer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPin(question.id)}>
                  <Pin size={14} className="mr-2" />
                  {question.isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onStatusChange(question.id, 'published')}>
                  <Check size={14} className="mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(question.id, 'rejected')}>
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
            <Badge variant="outline" className="text-xs">
              {question.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(question.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="font-medium mb-3">{question.question}</h4>
          
          {question.answers.length > 0 && (
            <div className="space-y-3 mb-3">
              {question.answers.slice(0, 2).map((answer) => (
                <div key={answer.id} className={cn(
                  "p-3 rounded-lg border-l-2",
                  answer.author.type === 'admin' 
                    ? "bg-blue-50 border-l-blue-500" 
                    : "bg-gray-50 border-l-gray-300"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{answer.author.name}</span>
                    <Badge variant={answer.author.type === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      {answer.author.type === 'admin' ? 'Admin' : 'Customer'}
                    </Badge>
                    {answer.isAccepted && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        <Check size={10} className="mr-1" />
                        Accepted
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{answer.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={12} />
                      {answer.helpful}
                    </div>
                    {answer.notHelpful > 0 && (
                      <div className="flex items-center gap-1">
                        <ThumbsDown size={12} />
                        {answer.notHelpful}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {question.answers.length > 2 && (
                <Button variant="link" className="p-0 h-auto text-xs" onClick={() => onView(question)}>
                  View {question.answers.length - 2} more answer{question.answers.length - 2 === 1 ? '' : 's'}
                </Button>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                {question.helpful}
              </div>
              {question.notHelpful > 0 && (
                <div className="flex items-center gap-1">
                  <ThumbsDown size={12} />
                  {question.notHelpful}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>{question.answers.length} answer{question.answers.length === 1 ? '' : 's'}</span>
              {question.answers.length === 0 && (
                <Badge variant="outline" className="text-xs text-orange-600">
                  Needs Answer
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuestionDetailModal = ({ 
  question, 
  isOpen, 
  onClose 
}: { 
  question: Question | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [newAnswer, setNewAnswer] = useState('');

  if (!question) return null;

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return;
    
    toast.success('Answer submitted successfully');
    setNewAnswer('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
          <DialogDescription>
            Manage question and provide answers
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer & Product Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={question.customer.avatar} />
                <AvatarFallback>
                  {question.customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{question.customer.name}</span>
                  {question.customer.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <Check size={10} className="mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{question.customer.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              {question.product.image && (
                <img 
                  src={question.product.image} 
                  alt={question.product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{question.product.title}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {question.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Question</span>
              <span className="text-xs text-blue-700">
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-blue-900">{question.question}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-blue-700">
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                {question.helpful} helpful
              </div>
              {question.notHelpful > 0 && (
                <div className="flex items-center gap-1">
                  <ThumbsDown size={12} />
                  {question.notHelpful} not helpful
                </div>
              )}
            </div>
          </div>

          {/* Existing Answers */}
          {question.answers.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Answers ({question.answers.length})</h4>
              {question.answers.map((answer) => (
                <div key={answer.id} className={cn(
                  "p-4 rounded-lg border-l-4",
                  answer.author.type === 'admin' 
                    ? "bg-green-50 border-l-green-500" 
                    : "bg-gray-50 border-l-gray-300"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{answer.author.name}</span>
                      <Badge variant={answer.author.type === 'admin' ? 'default' : 'secondary'} className="text-xs">
                        {answer.author.type === 'admin' ? 'Store Admin' : 'Customer'}
                      </Badge>
                      {answer.isAccepted && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          <Check size={10} className="mr-1" />
                          Accepted Answer
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(answer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mb-3">{answer.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={12} />
                        {answer.helpful}
                      </div>
                      {answer.notHelpful > 0 && (
                        <div className="flex items-center gap-1">
                          <ThumbsDown size={12} />
                          {answer.notHelpful}
                        </div>
                      )}
                    </div>
                    {!answer.isAccepted && (
                      <Button variant="outline" size="sm">
                        <Check size={14} className="mr-2" />
                        Mark as Accepted
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Answer */}
          <div className="space-y-3">
            <h4 className="font-medium">Add Your Answer</h4>
            <Textarea 
              placeholder="Provide a helpful answer to this customer's question..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={4}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Your answer will be posted as Store Admin
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setNewAnswer('')}>
                  Clear
                </Button>
                <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
                  <Reply size={14} className="mr-2" />
                  Post Answer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function QA() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(mockQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let filtered = questions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(question => 
        question.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Product filter
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(question => question.product.id === selectedProduct);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(question => question.status === selectedStatus);
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(question => question.category === selectedCategory);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'answers':
          return b.answers.length - a.answers.length;
        default:
          return 0;
      }
    });

    // Pin questions to top
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    setFilteredQuestions(filtered);
  }, [questions, searchQuery, selectedProduct, selectedStatus, selectedCategory, sortBy]);

  const handleStatusChange = (id: string, status: Question['status']) => {
    setQuestions(prev => 
      prev.map(question => 
        question.id === id ? { ...question, status } : question
      )
    );
    toast.success(`Question ${status === 'published' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}`);
  };

  const handlePin = (id: string) => {
    setQuestions(prev => 
      prev.map(question => 
        question.id === id ? { ...question, isPinned: !question.isPinned } : question
      )
    );
    const question = questions.find(q => q.id === id);
    toast.success(`Question ${question?.isPinned ? 'unpinned' : 'pinned'}`);
  };

  const handleAnswer = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      setSelectedQuestion(question);
      setIsDetailModalOpen(true);
    }
  };

  const handleViewDetails = (question: Question) => {
    setSelectedQuestion(question);
    setIsDetailModalOpen(true);
  };

  const stats = {
    total: questions.length,
    published: questions.filter(q => q.status === 'published').length,
    pending: questions.filter(q => q.status === 'pending').length,
    unanswered: questions.filter(q => q.answers.length === 0).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Q&A Engine</h2>
          <p className="text-muted-foreground">
            Manage customer questions and build a helpful knowledge base
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus size={16} className="mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
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
                <p className="text-sm text-muted-foreground">Unanswered</p>
                <p className="text-2xl font-bold">{stats.unanswered}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
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
                  placeholder="Search questions by customer, product, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
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
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SortAsc size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                  <SelectItem value="answers">Most Answers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onStatusChange={handleStatusChange}
            onAnswer={handleAnswer}
            onPin={handlePin}
            onView={handleViewDetails}
          />
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedProduct !== 'all' || selectedStatus !== 'all' || selectedCategory !== 'All Categories'
                ? 'Try adjusting your filters or search query.'
                : 'Customer questions will appear here once they start asking.'}
            </p>
            <Button variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Question Detail Modal */}
      <QuestionDetailModal
        question={selectedQuestion}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}