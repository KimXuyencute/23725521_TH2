import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';

export const Watermark = () => {
  const stamp = examStamp();
  const textContent = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View
      style={[
        styles.container,
        VARIANT.watermarkAtTop ? styles.positionTop : styles.positionBottom,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text} numberOfLines={1}>
        {textContent}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
    zIndex: 999,
  },
  positionTop: {
    // Đặt ở trên
  },
  positionBottom: {
    // Đặt ở dưới
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.primary,
    letterSpacing: 0.2,
  },
});
