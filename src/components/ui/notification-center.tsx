import { useState, useEffect } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { ScrollArea } from './scroll-area';
import { 
  Bell, 
  Check, 
  X, 
  Star, 
  MessageSquare, 
  Mail, 
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'review' | 'question' | 'campaign' | 'moderation' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'review',
    title: 'New 5-star review',
    message: 'Sarah Johnson left a 5-star review for Wireless Bluetooth Headphones',
    timestamp: '2024-07-16T10:30:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/reviews'
  },
  {
    id: '2',
    type: 'moderation',
    title: 'Review flagged for moderation',
    message: 'A review has been flagged by AI for potential spam content',
    timestamp: '2024-07-16T09:15:00Z',
    read: false,
    priority: 'high',
    actionUrl: '/moderation'
  },
  {
    id: '3',
    type: 'question',
    title: 'New customer question',
    message: 'Mike Chen asked about battery life for Smart Fitness Watch',
    timestamp: '2024-07-16T08:45:00Z',
    read: true,
    priority: 'medium',
    actionUrl: '/qa'
  },
  {
    id: '4',
    type: 'campaign',
    title: 'Campaign milestone reached',
    message: 'Post-Purchase Review Request campaign reached 1000 emails sent',
    timestamp: '2024-07-15T16:20:00Z',
    read: true,
    priority: 'low',
    actionUrl: '/campaigns'
  },
  {
    id: '5',
    type: 'system',
    title: 'Weekly report ready',
    message: 'Your weekly analytics report is now available for download',
    timestamp: '2024-07-15T09:00:00Z',
    read: false,
    priority: 'low',
    actionUrl: '/analytics'
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'review':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'question':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'campaign':
      return <Mail className="h-4 w-4 text-green-500" />;
    case 'moderation':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'system':
      return <Bell className="h-4 w-4 text-gray-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50/50';
    case 'medium':
      return 'border-l-yellow-500 bg-yellow-50/50';
    case 'low':
      return 'border-l-gray-300 bg-gray-50/50';
    default:
      return 'border-l-gray-300 bg-gray-50/50';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (for demo purposes)
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'review',
          title: 'New review received',
          message: 'A customer just left a review for one of your products',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          actionUrl: '/reviews'
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 border-l-2 hover:bg-muted/50 cursor-pointer transition-colors",
                        getPriorityColor(notification.priority),
                        !notification.read && "bg-blue-50/30"
                      )}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          // Navigate to the action URL
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Mark read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}