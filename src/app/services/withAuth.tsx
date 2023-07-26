// withAuth.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/app/services/firebaseService';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const auth: any = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Verificar si el usuario está autenticado
      if (!auth?.user || auth.user.isAnonymous) {
          router.push('/auth/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
