import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import ShopifyAPIService from '../../services/shopifyApi';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

interface OnboardingWizardProps {
  onComplete: (data: { shopDomain: string; accessToken: string }) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'intro',
      title: 'Welcome to TrustLoop',
      description: 'Set up your Shopify store connection',
      status: currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : 'pending'
    },
    {
      id: 'permissions',
      title: 'Create Private App',
      description: 'Set up API access in your Shopify admin',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending'
    },
    {
      id: 'connect',
      title: 'Connect Store',
      description: 'Enter your store details and API credentials',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending'
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Your store is now connected to TrustLoop',
      status: currentStep === 3 ? 'active' : 'pending'
    }
  ];

  const requiredScopes = [
    'read_products',
    'read_orders', 
    'read_customers',
    'read_themes',
    'write_script_tags'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnect = async () => {
    if (!shopDomain || !accessToken) {
      toast.error('Please enter both shop domain and access token');
      return;
    }

    setIsConnecting(true);
    
    try {
      // Test the connection using our Shopify API service
      const apiService = new ShopifyAPIService(shopDomain, accessToken);
      const isConnected = await apiService.testConnection();
      
      if (isConnected) {
        // Get store info to verify connection
        const shopInfo = await apiService.getShop();
        toast.success(`Successfully connected to ${shopInfo.name}!`);
        onComplete({ shopDomain, accessToken });
        setCurrentStep(3);
      } else {
        toast.error('Failed to connect store. Please check your credentials.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect store. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Welcome to TrustLoop!</h3>
              <p className="text-muted-foreground">
                Let's connect your Shopify store to start collecting reviews, managing Q&A, and boosting conversions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Shield size={24} className="text-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Secure</h4>
                <p className="text-sm text-muted-foreground">End-to-end encryption</p>
              </Card>
              <Card className="text-center p-4">
                <Zap size={24} className="text-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Fast Setup</h4>
                <p className="text-sm text-muted-foreground">Ready in 5 minutes</p>
              </Card>
              <Card className="text-center p-4">
                <CheckCircle size={24} className="text-accent mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Easy to Use</h4>
                <p className="text-sm text-muted-foreground">No coding required</p>
              </Card>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Create a Private App in Shopify</h3>
              <p className="text-muted-foreground mb-4">
                Follow these steps to create API credentials for TrustLoop:
              </p>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <span className="font-medium">Go to your Shopify admin</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Navigate to Settings → Apps and sales channels → Develop apps
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <span className="font-medium">Create a private app</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Click "Create an app" and name it "TrustLoop Integration"
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <span className="font-medium">Configure Admin API access</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8 mb-3">
                  Enable the following scopes:
                </p>
                <div className="ml-8 grid grid-cols-2 gap-2">
                  {requiredScopes.map((scope) => (
                    <div key={scope} className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {scope}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(scope)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
                  <span className="font-medium">Install the app</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Save and install the app to generate your access token
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Need help?</p>
                  <p className="text-sm text-blue-700">
                    Check out our{' '}
                    <Button variant="link" className="p-0 h-auto text-blue-700 underline">
                      step-by-step guide
                      <ExternalLink size={12} className="ml-1" />
                    </Button>
                    {' '}for detailed instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Store</h3>
              <p className="text-muted-foreground">
                Enter your Shopify store details and the access token from your private app.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopDomain">Shop Domain</Label>
                <Input
                  id="shopDomain"
                  placeholder="your-store.myshopify.com"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your shop's .myshopify.com domain (without https://)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Admin API Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="shpat_..."
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Copy this from your private app's Admin API access tokens section
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Demo Mode</p>
                  <p className="text-sm text-blue-700 mb-2">
                    For testing purposes, use these demo credentials:
                  </p>
                  <div className="text-xs bg-white p-2 rounded border">
                    <div className="font-medium">Shop Domain:</div>
                    <code className="text-blue-800">demo-store.myshopify.com</code>
                    <div className="font-medium mt-1">Access Token:</div>
                    <code className="text-blue-800">demo_token</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <Shield size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Security Note</p>
                  <p className="text-sm text-yellow-700">
                    Your access token is encrypted and stored securely. We never share or store your data in plain text.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleConnect} 
              disabled={!shopDomain || !accessToken || isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Store'
              )}
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
              <p className="text-muted-foreground">
                Your Shopify store is now connected to TrustLoop. You can start collecting reviews and managing customer feedback.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Set up your review widgets on product pages</li>
                <li>• Configure email campaigns for review requests</li>
                <li>• Enable Q&A for customer questions</li>
                <li>• Customize moderation settings</li>
              </ul>
            </div>

            <Button onClick={() => window.location.reload()} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${step.status === 'completed' 
                      ? 'bg-accent border-accent text-white' 
                      : step.status === 'active' 
                        ? 'border-primary text-primary bg-primary/10' 
                        : 'border-muted text-muted-foreground bg-background'
                    }
                  `}>
                    {step.status === 'completed' ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      step.status === 'active' ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    steps[index + 1].status !== 'pending' ? 'bg-accent' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{steps[currentStep]?.title}</CardTitle>
            <CardDescription>{steps[currentStep]?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
          
          {currentStep !== 3 && (
            <>
              <Separator />
              <div className="p-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === 2}
                >
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}