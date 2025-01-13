import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadCurrentUser } from '@/services/authService';
import { User, UserRole } from '@/types/user';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const checkAdminRole = async () => {
    const currentUser = loadCurrentUser();
    setCurrentUser(currentUser)
    if (!currentUser) {
      router.push('/auth/login');
    } else if (currentUser.role !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }

  useEffect(() => {
    checkAdminRole();
  }, []);

  console.log("currentUser", currentUser);

  return <>{currentUser?.role === UserRole.ADMIN ? children : null}</>;
};

export default AdminRoute;
