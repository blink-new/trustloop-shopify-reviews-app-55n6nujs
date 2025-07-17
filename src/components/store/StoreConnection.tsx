import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  ShoppingBag, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Settings,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';

interface StoreData {
  name: string;
  domain: string;
  plan: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  permissions: {
    name: string;
    granted: boolean;
    required: boolean;
  }[];
}

interface StoreConnectionProps {
  store?: StoreData;
  onReconnect: () => void;
  onManageConnection: () => void;
}

export function StoreConnection({ store, onReconnect, onManageConnection }: StoreConnectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    onReconnect();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-accent';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  if (!store) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag size={20} />
            Store Connection
          </CardTitle>
          <CardDescription>
            No store connected. Please complete the onboarding process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Store Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your Shopify store to start using TrustLoop features.
            </p>
            <Button onClick={onManageConnection}>
              Connect Store
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              Store Connection
            </div>
            {getStatusBadge(store.status)}
          </CardTitle>
          <CardDescription>
            Manage your Shopify store connection and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Store Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Store Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Store Name:</span>
                  <span className="font-medium">{store.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-medium">{store.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{store.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="font-medium">{store.lastSync}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Connection Status</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {store.status === 'connected' ? (
                    <CheckCircle size={16} className="text-accent" />
                  ) : (
                    <AlertCircle size={16} className="text-destructive" />
                  )}
                  <span className={`text-sm font-medium ${getStatusColor(store.status)}`}>
                    {store.status === 'connected' ? 'Active Connection' : 'Connection Issues'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <RefreshCw size={14} className="mr-2 animate-spin" />
                    ) : (
                      <RefreshCw size={14} className="mr-2" />
                    )}
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={onManageConnection}>
                    <Settings size={14} className="mr-2" />
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          <div>
            <h4 className="font-medium mb-3">API Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {store.permissions.map((permission) => (
                <div 
                  key={permission.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {permission.granted ? (
                      <CheckCircle size={16} className="text-accent" />
                    ) : (
                      <AlertCircle size={16} className={permission.required ? "text-destructive" : "text-muted-foreground"} />
                    )}
                    <span className="text-sm font-medium">
                      {permission.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {permission.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                    <Badge 
                      variant={permission.granted ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {permission.granted ? "Granted" : "Not Granted"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {store.status !== 'connected' && (
            <>
              <Separator />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Connection Issue Detected</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      There seems to be an issue with your store connection. This might affect app functionality.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={onReconnect}>
                        Reconnect Store
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink size={14} className="mr-2" />
                        Get Help
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {store.status === 'connected' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold">Secure Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data is encrypted and secure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Real-time Sync</h4>
                  <p className="text-sm text-muted-foreground">
                    Data syncs automatically
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}