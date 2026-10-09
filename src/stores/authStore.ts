import { create } from 'zustand';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  identifier: string;
  login: (input: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  identifier: '',
  login: (input: string) => {
    // Nút Vào cửa hàng lưu token giả ktxgo-{mssv}-{stamp} rồi vào Main Tabs
    const fakeToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    set({ token: fakeToken, identifier: input });
  },
  logout: () => {
    set({ token: null, identifier: '' });
  },
}));
