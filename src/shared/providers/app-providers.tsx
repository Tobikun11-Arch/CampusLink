import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React, {PropsWithChildren, useEffect, useState} from 'react';

import {authStore} from '../stores/auth.store';

export function AppProviders({children}: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    void authStore.getState().bootstrap();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
