import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blink } from '../blink/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.isAuthenticated) {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = () => {
    blink.auth.login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to TrustLoop</CardTitle>
          <CardDescription>Sign in to continue to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} className="w-full">
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
