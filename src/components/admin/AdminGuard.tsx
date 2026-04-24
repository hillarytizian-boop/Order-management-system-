import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'staff';
}

export default function AdminGuard({ children, requiredRole }: Props) {
  const { session } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session?.twoFactorVerified) {
      navigate('/admin/login', { replace: true });
      return;
    }
    if (requiredRole === 'admin' && session.role !== 'admin') {
      navigate('/staff', { replace: true });
    }
  }, [session, navigate, requiredRole]);

  if (!session?.twoFactorVerified) return null;
  if (requiredRole === 'admin' && session.role !== 'admin') return null;

  return <>{children}</>;
}
