import React from 'react';
import { View, StyleSheet } from 'react-native';
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

// Biểu tượng Cửa hàng (Túi mua sắm)
const ShopTabIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View
      style={[
        styles.shopHandle,
        {
          borderColor: color,
        },
      ]}
    />
    <View
      style={[
        styles.shopBody,
        {
          borderColor: color,
        },
      ]}
    >
      <View style={[styles.shopDot, { backgroundColor: color }]} />
    </View>
  </View>
);

// Biểu tượng Giỏ hàng (Xe đẩy + 2 bánh xe)
const CartTabIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={styles.cartUpper}>
      <View style={[styles.cartHandle, { borderColor: color }]} />
      <View style={[styles.cartBasket, { borderColor: color }]} />
    </View>
    <View style={styles.cartWheels}>
      <View style={[styles.wheel, { backgroundColor: color }]} />
      <View style={[styles.wheel, { backgroundColor: color }]} />
    </View>
  </View>
);

// Biểu tượng Tôi (Tài khoản người dùng)
const MeTabIcon = ({ color, size = 22 }: { color: string; size?: number }) => (
  <View style={[styles.iconContainer, { width: size, height: size }]}>
    <View style={[styles.userHead, { borderColor: color }]} />
    <View style={[styles.userBody, { borderColor: color }]} />
  </View>
);

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
        tabBarIcon: ({ color, size }) => <ShopTabIcon color={color} size={size} />,
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
        tabBarIcon: ({ color, size }) => <CartTabIcon color={color} size={size} />,
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: {
          backgroundColor: theme.secondary,
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '700',
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          lineHeight: 14,
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
        tabBarIcon: ({ color, size }) => <MeTabIcon color={color} size={size} />,
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
          borderTopWidth: 1,
          height: 58,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {isShopFirst ? [shopTab, cartTab, meTab] : [cartTab, shopTab, meTab]}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Shop Icon styles
  shopHandle: {
    width: 9,
    height: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1.8,
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  shopBody: {
    width: 17,
    height: 13,
    borderRadius: 3,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopDot: {
    width: 5,
    height: 2,
    borderRadius: 1,
  },
  // Cart Icon styles
  cartUpper: {
    width: 19,
    height: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cartHandle: {
    width: 4,
    height: 11,
    borderLeftWidth: 1.8,
    borderTopWidth: 1.8,
    borderTopLeftRadius: 2,
  },
  cartBasket: {
    width: 14,
    height: 10,
    borderWidth: 1.8,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  cartWheels: {
    width: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
    marginLeft: 3,
  },
  wheel: {
    width: 3.2,
    height: 3.2,
    borderRadius: 1.6,
  },
  // Me Icon styles
  userHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.8,
    marginBottom: 2,
  },
  userBody: {
    width: 16,
    height: 7,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1.8,
    borderBottomWidth: 0,
  },
});

