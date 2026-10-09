import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@constants/theme';
import { STUDENT, VARIANT } from '@constants/student';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';

export const LoginScreen = () => {
  const isPhone = VARIANT.authField === 'phone';
  const defaultVal = isPhone ? `09${STUDENT.mssv}` : `${STUDENT.mssv}@iuh.edu.vn`;
  const [inputValue, setInputValue] = useState('');

  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      Alert.alert(
        'Lỗi đăng nhập',
        isPhone ? 'Vui lòng nhập số điện thoại sinh viên' : 'Vui lòng nhập email sinh viên',
      );
      return;
    }
    login(trimmed);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.brandTitle}>KTXGO</Text>
          <Text style={styles.brandSubtitle}>Giao đồ tận phòng ký túc xá</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>
              {isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên'}
            </Text>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              placeholder={
                isPhone
                  ? `SĐT (MSSV: ${STUDENT.mssv})`
                  : `Email (MSSV: ${STUDENT.mssv})`
              }
              placeholderTextColor={theme.textLight}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Vào cửa hàng</Text>
          </TouchableOpacity>

          <Text style={styles.footerHint}>Auth Stack · chưa có token</Text>
        </View>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: theme.textLight,
    marginTop: 4,
    marginBottom: 24,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.text,
    backgroundColor: '#F8FAFC',
  },
  button: {
    width: '100%',
    height: 46,
    backgroundColor: theme.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerHint: {
    fontSize: 12,
    color: theme.textLight,
    marginTop: 18,
  },
});
