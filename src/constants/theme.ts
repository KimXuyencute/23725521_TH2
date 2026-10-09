export const theme = {
  primary: '#1D4ED8',      // nút, tab chọn, giá
  secondary: '#F97316',    // badge giỏ, phí ship
  background: '#EFF6FF',   // nền sáng
  surface: '#FFFFFF',      // card
  text: '#1E3A8A',         // chữ chính
  textLight: '#64748B',    // chữ phụ / ghi chú
  border: '#BFDBFE',       // viền
  error: '#DC2626',        // báo lỗi
  success: '#16A34A',      // thông báo thành công
} as const;

export type Theme = typeof theme;
