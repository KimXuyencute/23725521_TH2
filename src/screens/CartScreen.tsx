import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore, CartItem } from '@stores/cartStore';
import { ROOM_LABEL, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { Watermark } from '@components/Watermark';

export const CartScreen = () => {
  const {
    items,
    removeItem,
    changeQty,
    totalAmount,
    shippingFee,
  } = useCartStore();

  const totalGoods = totalAmount();
  const calculatedTotal = totalGoods + (shippingFee ?? 0);

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemPriceDetail}>
          x{item.quantity}  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
        </Text>
      </View>

      <View style={styles.qtyControls}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => changeQty(item.id, -1)}
        >
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => changeQty(item.id, 1)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => removeItem(item.id)}
          accessibilityLabel="Xoá món"
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Hãy quay lại tab Cửa hàng để thêm món ăn yêu thích!
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
          />

          {/* Khung giao hàng & phí ship */}
          <View style={styles.deliveryBox}>
            <Text style={styles.deliveryRoom}>Giao đến {ROOM_LABEL}</Text>
            {shippingFee !== null ? (
              <Text style={styles.deliveryFee}>
                Phí ship: {shippingFee.toLocaleString('vi-VN')} đ (công thức {VARIANT.shipFormula})
              </Text>
            ) : (
              <Text style={styles.deliveryFeePending}>
                Chưa ước tính phí — mở tab Tôi
              </Text>
            )}
          </View>

          {/* Tổng tiền */}
          <View style={styles.totalBox}>
            <Text style={styles.totalText}>
              Tổng hàng: {calculatedTotal.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  listContainer: {
    paddingBottom: 10,
  },
  itemCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  itemPriceDetail: {
    fontSize: 13,
    color: theme.textLight,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
  },
  qtyText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    minWidth: 16,
    textAlign: 'center',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  deliveryBox: {
    borderWidth: 1.5,
    borderColor: theme.secondary,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFF7ED',
    marginBottom: 10,
  },
  deliveryRoom: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  deliveryFee: {
    fontSize: 13,
    color: theme.secondary,
    fontWeight: '600',
  },
  deliveryFeePending: {
    fontSize: 13,
    color: theme.textLight,
    fontStyle: 'italic',
  },
  totalBox: {
    backgroundColor: theme.surface,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  totalText: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.textLight,
    textAlign: 'center',
  },
});
