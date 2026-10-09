import { useState, useCallback } from 'react';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

// Toạ độ cổng KTX cố định (Ký túc xá IUH - Gò Vấp, TP.HCM)
export const KTX_GATE_COORDS: Coordinates = {
  latitude: 10.8222,
  longitude: 106.6875,
};

// Toạ độ giả lập khi chạy trên máy ảo (~1.2 km tới cổng KTX)
export const MOCK_USER_COORDS: Coordinates = {
  latitude: 10.8315,
  longitude: 106.6942,
};

// Công thức Haversine tính khoảng cách đường chim bay (km)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(1)); // Làm tròn 1 chữ số thập phân
}

// Tính phí ship theo công thức A hoặc B từ số cuối MSSV
export function calculateShippingFee(distanceKm: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(distanceKm * 2000);
  }
  // Công thức B
  return BASE_SHIP_FEE + Math.round(distanceKm * 1500) + 2000;
}

export function useCampusLocation() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setStoreShippingFee = useCartStore((s) => s.setShippingFee);
  const setStoreDistanceKm = useCartStore((s) => s.setDistanceKm);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch(() => {
      Alert.alert('Không thể mở Cài đặt', 'Vui lòng mở cài đặt ứng dụng trên thiết bị bằng tay.');
    });
  }, []);

  const requestPermissionAndGetLocation = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    let status: PermissionStatus = 'denied';

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'KTXGo cần quyền vị trí',
            message: 'Cho phép KTXGo truy cập vị trí để ước tính khoảng cách và phí ship tận phòng.',
            buttonPositive: 'Cho phép',
            buttonNegative: 'Từ chối',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          status = 'granted';
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          status = 'blocked';
        } else {
          status = 'denied';
        }
      } else {
        // iOS
        status = 'granted';
      }

      setPermissionStatus(status);

      if (status === 'blocked') {
        setLoading(false);
        setErrorMsg('Quyền vị trí đã bị chặn (blocked). Hãy bấm nút bên dưới để mở Cài đặt.');
        return;
      }

      if (status === 'denied') {
        setLoading(false);
        setErrorMsg('Bạn đã từ chối cấp quyền vị trí. Vui lòng nhấn lại nút "Lấy vị trí ước tính ship" để cấp quyền.');
        return;
      }

      // Khi granted: Thử lấy vị trí qua Geolocation, nếu lỗi hoặc timeout (trên máy ảo) thì dùng toạ độ mock
      const handleSuccessCoords = (c: Coordinates) => {
        setCoords(c);
        const dist = calculateHaversineDistance(
          c.latitude,
          c.longitude,
          KTX_GATE_COORDS.latitude,
          KTX_GATE_COORDS.longitude,
        );
        const fee = calculateShippingFee(dist);
        setDistanceKm(dist);
        setStoreDistanceKm(dist);
        setStoreShippingFee(fee);
        setLoading(false);
      };

      try {
        Geolocation.getCurrentPosition(
          (pos) => {
            const rawLat = pos.coords.latitude;
            const rawLon = pos.coords.longitude;
            // Nếu là toạ độ mặc định của máy ảo Android (Mountain View, California), mock về toạ độ gần KTX
            const isEmulatorDefaultUSA =
              Math.abs(rawLat - 37.42) < 1 && Math.abs(rawLon - (-122.08)) < 1;

            if (isEmulatorDefaultUSA) {
              handleSuccessCoords(MOCK_USER_COORDS);
            } else {
              handleSuccessCoords({
                latitude: rawLat,
                longitude: rawLon,
              });
            }
          },
          (_err) => {
            // Máy ảo hoặc không có GPS phần cứng: mock toạ độ theo yêu cầu đề thi
            handleSuccessCoords(MOCK_USER_COORDS);
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 30000 },
        );
      } catch (_err) {
        // Fallback mock toạ độ
        handleSuccessCoords(MOCK_USER_COORDS);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Lỗi khi yêu cầu quyền vị trí');
    }
  }, [setStoreDistanceKm, setStoreShippingFee]);

  return {
    permissionStatus,
    coords,
    distanceKm,
    loading,
    errorMsg,
    requestPermissionAndGetLocation,
    openSettings,
  };
}
