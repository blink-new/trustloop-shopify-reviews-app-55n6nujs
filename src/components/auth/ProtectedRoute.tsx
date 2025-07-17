import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { blink } from '../../blink/client';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (!state.isAuthenticated && !state.isLoading) {
        navigate('/login');
      }
      setIsLoading(state.isLoading);
    });
    return unsubscribe;
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
