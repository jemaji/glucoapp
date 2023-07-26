import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/app/services/firebaseService';
import hoistNonReactStatics from 'hoist-non-react-statics';

const withAuth = (WrappedComponent: any) => {
  const WithAuthComponent = (props: any) => {
    const auth: any = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Verificar si el usuario está autenticado
      if (!auth?.user || auth.user.isAnonymous) {
        router.push('/auth/login');
      }
    }, [auth?.user, router]);

    return <WrappedComponent {...props} />;
  };

  // Copia las propiedades estáticas del componente original al componente envuelto
  hoistNonReactStatics(WithAuthComponent, WrappedComponent);

  return WithAuthComponent;
};

export default withAuth;
