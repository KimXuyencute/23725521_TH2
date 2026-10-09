import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getProductById, Product } from '@services/productApi';
import { triggerHaptic } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';
import { STUDENT, PRICE_MULTIPLIER, STALE_TIME_MS, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

type DetailRouteParams = {
  Detail: { id: string };
};

export const DetailScreen = () => {
  const route = useRoute<RouteProp<DetailRouteParams, 'Detail'>>();
  const navigation = useNavigation();
  const productId = route.params?.id ?? '1';

  const addItem = useCartStore((s) => s.addItem);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    staleTime: STALE_TIME_MS,
  });

  const finalPrice = product ? Math.round(product.price * PRICE_MULTIPLIER) : 0;
  const formattedPrice = finalPrice.toLocaleString('vi-VN') + ' đ';

  const handleAddToCart = () => {
    if (!product) return;
    triggerHaptic();
    addItem({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: product.image,
    });
    Alert.alert(
      'Thành công',
      `Đã thêm món vào giỏ!\nMSSV: ${STUDENT.mssv} - ${STUDENT.hoTen}`,
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Chi tiết món</Text>
        </TouchableOpacity>
        <Text style={styles.badgePresentation}>Stack</Text>
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin món...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Không thể tải món id: {productId}
          </Text>
          <TouchableOpacity
            style={styles.backButtonCenter}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonCenterText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && product && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.imageCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formattedPrice}</Text>

            <View style={styles.badgeRow}>
              <Text style={styles.subText}>Giao nội khu · nhận tận phòng</Text>
            </View>

            <Text style={styles.descTitle}>Mô tả ngắn từ API (tối đa 3 dòng):</Text>
            <Text style={styles.description} numberOfLines={3}>
              {product.description}
            </Text>

            <Text style={styles.idNotice}>
              Giữ nguyên id từ route.params: {productId}
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.8}
              onPress={handleAddToCart}
            >
              <Text style={styles.addButtonText}>Thêm vào giỏ · Haptic</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
  badgePresentation: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textLight,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: theme.text,
  },
  errorText: {
    fontSize: 15,
    color: theme.error,
    marginBottom: 12,
  },
  backButtonCenter: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonCenterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  imageCard: {
    width: '100%',
    height: 240,
    backgroundColor: theme.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.primary,
    marginBottom: 6,
  },
  badgeRow: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  subText: {
    fontSize: 12,
    color: theme.textLight,
  },
  descTitle: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: theme.textLight,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: theme.text,
    lineHeight: 19,
    marginBottom: 12,
    textAlign: 'left',
    width: '100%',
  },
  idNotice: {
    fontSize: 12,
    color: theme.textLight,
    marginBottom: 18,
  },
  addButton: {
    width: '100%',
    height: 48,
    backgroundColor: theme.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
