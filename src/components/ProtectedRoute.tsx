import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const checkAuthenticated = async () => {
    const auth = await isAuthenticated();
    setIsAuth(auth);
    if (!auth) {
      router.push('/auth/login');
    }
  }

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return <>{isAuth ? children : null}</>;
};

export default ProtectedRoute;
