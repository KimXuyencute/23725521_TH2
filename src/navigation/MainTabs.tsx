import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

export type MainTabsParamList = {
  Shop: undefined;
  Cart: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs = () => {
  const totalQty = useCartStore((s) => s.totalQuantity());

  // Định nghĩa các tab
  const shopTab = (
    <Tab.Screen
      key="shop-tab"
      name="Shop"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
      }}
    />
  );

  const cartTab = (
    <Tab.Screen
      key="cart-tab"
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Giỏ',
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.secondary,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    />
  );

  const meTab = (
    <Tab.Screen
      key="me-tab"
      name="Me"
      component={MeScreen}
      options={{
        title: 'Tôi',
      }}
    />
  );

  // Thứ tự tab theo VARIANT.tabOrder: shopFirst hoặc cartFirst
  const isShopFirst = VARIANT.tabOrder === 'shopFirst';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLight,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 56,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {isShopFirst ? [shopTab, cartTab, meTab] : [cartTab, shopTab, meTab]}
    </Tab.Navigator>
  );
};
