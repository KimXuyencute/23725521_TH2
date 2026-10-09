import React from 'react';
import { useAuthStore } from '@stores/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

export const RootNavigator = () => {
  const token = useAuthStore((s) => s.token);

  // Chưa có token Zustand -> chỉ thấy AuthStack (Login). Có token -> vào MainTabs
  if (!token) {
    return <AuthStack />;
  }

  return <MainTabs />;
};
