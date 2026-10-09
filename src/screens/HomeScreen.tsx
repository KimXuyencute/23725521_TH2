import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getProducts, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';
import {
  STUDENT,
  DEBOUNCE_MS,
  STALE_TIME_MS,
  ROOM_LABEL,
  VARIANT,
} from '@constants/student';
import { theme } from '@constants/theme';

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [searchText, setSearchText] = useState('');

  // Debounce t??m ki???m ????ng DEBOUNCE_MS t??? seed MSSV
  const debouncedSearch = useDebouncedValue(searchText, DEBOUNCE_MS);

  // TanStack Query v???i staleTime = STALE_TIME_MS
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: STALE_TIME_MS,
  });

  // L???c s???n ph???m theo chu???i ???? debounce
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    const lower = debouncedSearch.toLowerCase().trim();
    return products.filter((item) => item.title.toLowerCase().includes(lower));
  }, [products, debouncedSearch]);

  const handlePressCard = (id: string) => {
    navigation.navigate('Detail', { id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* (A) Header KTXGO + Giao t???n {ROOM_LABEL} */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KTXGO</Text>
        <Text style={styles.headerSubtitle}>Giao t???n {ROOM_LABEL}</Text>
      </View>

      {/* (B) ?? t??m controlled; filter theo b???n debounce DEBOUNCE_MS */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`T??m m??n (debounce) ??? ${STUDENT.mssv}`}
          placeholderTextColor={theme.textLight}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
      </View>

      {/* Ba c???nh m???ng (thi???u m???t = sai C??u 2b) */}
      {/* C???nh 1: ??ANG T???I */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>??ang t???i m??n...</Text>
        </View>
      )}

      {/* C???nh 3: L???I M???NG (c?? MSSV + Th??? l???i) */}
      {!isLoading && isError && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorText}>
            Kh??ng t???i ???????c d??? li???u m??n.{'\n'}
            {(error as Error)?.message || 'Vui l??ng ki???m tra k???t n???i m???ng.'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.8}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Th??? l???i</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* C???nh 2: C?? D??? LI???U L?????I */}
      {!isLoading && !isError && (
        <View style={styles.listWrapper}>
          {React.createElement(FlashList as any, {
            data: filteredProducts,
            numColumns: 2,
            estimatedItemSize: 200,
            keyExtractor: (item: Product) => `${STUDENT.mssv}-${item.id}`,
            renderItem: ({ item }: { item: Product }) => (
              <ProductCard product={item} onPress={handlePressCard} />
            ),
            refreshing: isRefetching,
            onRefresh: refetch,
            contentContainerStyle: styles.listContent,
            ListEmptyComponent: (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Kh??ng t??m th???y m??n ph?? h???p</Text>
              </View>
            ),
          })}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: theme.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.textLight,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: theme.background,
  },
  searchInput: {
    height: 44,
    backgroundColor: theme.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.border,
    fontSize: 14,
    color: theme.text,
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  errorMssv: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.error,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: theme.error,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.textLight,
  },
});

