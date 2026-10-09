import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, examStamp } from '@constants/student';
import { theme } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import { VARIANT } from '@constants/student';

export const MeScreen = () => {
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);
  const stamp = examStamp();
  const shortToken = token ? `${token.slice(0, 16)}...` : 'chưa có';

  const {
    permissionStatus,
    distanceKm,
    loading,
    errorMsg,
    requestPermissionAndGetLocation,
    openSettings,
  } = useCampusLocation();

  const storeShippingFee = useCartStore((s) => s.shippingFee);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card thông tin sinh viên */}
        <View style={styles.profileCard}>
          <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
          <Text style={styles.studentSub}>
            {STUDENT.mssv} · #{stamp}
          </Text>
          <Text style={styles.tokenText}>
            Token: <Text style={styles.tokenVal}>{shortToken}</Text>
          </Text>
        </View>

        {/* Khung Quyền Vị Trí & Khoảng Cách & Phí Ship */}
        <View style={styles.locationCard}>
          <Text style={styles.statusLabel}>
            Quyền: <Text style={styles.statusVal}>{permissionStatus}</Text>
          </Text>

          {distanceKm !== null ? (
            <Text style={styles.distanceVal}>
              ≈ {distanceKm} km tới cổng KTX
            </Text>
          ) : (
            <Text style={styles.pendingVal}>
              Chưa đo khoảng cách tới cổng KTX
            </Text>
          )}

          <Text style={styles.feeLabel}>Phí ship ước tính</Text>
          <Text style={styles.feeVal}>
            {storeShippingFee !== null
              ? `${storeShippingFee.toLocaleString('vi-VN')} đ`
              : '--- đ'}
          </Text>

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
        </View>

        {/* Nút Lấy vị trí ước tính ship */}
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={requestPermissionAndGetLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionBtnText}>Lấy vị trí ước tính ship</Text>
          )}
        </TouchableOpacity>

        {/* Nút Mở Cài đặt (blocked) */}
        <TouchableOpacity
          style={[styles.outlineBtn, permissionStatus !== 'blocked' && styles.outlineBtnDisabled]}
          activeOpacity={0.7}
          onPress={openSettings}
        >
          <Text style={styles.outlineBtnText}>Mở Cài đặt (blocked)</Text>
        </TouchableOpacity>

        {/* Nút Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={logout}
        >
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

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
    padding: 16,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.text,
    marginBottom: 4,
  },
  studentSub: {
    fontSize: 13,
    color: theme.textLight,
    marginBottom: 4,
  },
  tokenText: {
    fontSize: 12,
    color: theme.textLight,
  },
  tokenVal: {
    fontWeight: '700',
    color: theme.primary,
  },
  locationCard: {
    width: '100%',
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 6,
  },
  statusVal: {
    fontWeight: '700',
    color: theme.primary,
  },
  distanceVal: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
    marginBottom: 10,
  },
  pendingVal: {
    fontSize: 13,
    color: theme.textLight,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  feeLabel: {
    fontSize: 12,
    color: theme.textLight,
    marginBottom: 2,
  },
  feeVal: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.secondary,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: theme.error,
  },
  actionBtn: {
    width: '100%',
    height: 48,
    backgroundColor: theme.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  outlineBtn: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    marginBottom: 16,
  },
  outlineBtnDisabled: {
    opacity: 0.7,
  },
  outlineBtnText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    width: '100%',
    height: 48,
    backgroundColor: theme.error,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
