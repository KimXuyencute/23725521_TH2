import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { Product } from '@services/productApi';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: (id: string) => void;
}

export const triggerHaptic = () => {
  try {
    if (VARIANT.hapticOnAdd === 'impact') {
      Vibration.vibrate(40);
    } else {
      // selection
      Vibration.vibrate(15);
    }
  } catch (_e) {
    // Bỏ qua nếu thiết bị không hỗ trợ rung
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((s) => s.addItem);

  // Tính giá theo công thức: Math.round(price * PRICE_MULTIPLIER)
  const finalPrice = Math.round(product.price * PRICE_MULTIPLIER);
  const formattedPrice = finalPrice.toLocaleString('vi-VN') + ' đ';

  const handleAdd = () => {
    triggerHaptic();
    addItem({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: product.image,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress(String(product.id))}
    >
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.price}>{formattedPrice}</Text>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={handleAdd}
          accessibilityLabel="Thêm vào giỏ"
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.text,
    minHeight: 34,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.primary,
    flex: 1,
    marginRight: 4,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
});
