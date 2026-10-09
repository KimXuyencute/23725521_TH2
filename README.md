NGUYỄN THỊ KIM XUYẾN | 23725521 | https://github.com/KimXuyencute/23725521_TH2.git | #472350 | Số cuối: 1 | Watermark: Dưới | Ô Login: phone | Thứ tự Tab: Shop→Giỏ→Tôi | Haptic: selection | Phí: B | Detail: card

# ĐỀ KIỂM TRA THỰC HÀNH 2 — KTXGo
- **Môn học:** Lập trình cho thiết bị di động (TH)
- **Họ và tên thí sinh:** NGUYỄN THỊ KIM XUYẾN
- **MSSV:** 23725521
- **Lớp / Khóa:** CN Điện Tử — Trường Đại Học Công Nghiệp TP.HCM (IUH)
- **Exam Stamp:** `#472350`
- **Link GitHub repo:** https://github.com/KimXuyencute/23725521_TH2.git

---

## 1. THÔNG SỐ VÀ BIẾN THỂ THEO MSSV 23725521
- **Số cuối (LAST_DIGIT):** `1`
- **STUDENT_SEED:** `521`
- **DEBOUNCE_MS:** `300 + (521 % 5) * 100 = 400 ms`
- **STALE_TIME_MS:** `10_000 + (521 % 20) * 1000 = 11_000 ms`
- **PRICE_MULTIPLIER:** `15000 + (521 % 40) * 500 = 15,500`
- **BASE_SHIP_FEE:** `8000 + (521 % 10) * 1000 = 9,000 đ`
- **ROOM_LABEL:** `P.221` (công thức: `P.${100 + (521 % 400)}`)
- **BANNER_IMAGE_ID:** `271`
- **VARIANT:**
  - Watermark: **Dưới** (`watermarkAtTop: false`)
  - Ô Login: **phone** (`authField: 'phone'`)
  - Thứ tự Tab: **Shop → Giỏ → Tôi** (`tabOrder: 'shopFirst'`)
  - Haptic: **selection** (`hapticOnAdd: 'selection'`)
  - Công thức phí ship: **B** (`BASE_SHIP_FEE + Math.round(km * 1500) + 2000`)
  - Detail presentation: **card** (`detailPresentation: 'card'`)

---

## 2. KẾT QUẢ ĐÁP ỨNG CÁC CÂU HỎI

### Câu 1: Navigation + Định danh (3 điểm)
- **Cấu trúc project chuẩn React Native CLI + TypeScript**: Thư mục `KTXGo_23725521`, package.json tên `ktxgo-23725521`, cấu hình alias `@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation`.
- **src/constants/student.ts**: Khai báo chuẩn `STUDENT`, `LAST_DIGIT`, `STUDENT_SEED`, `VARIANT`, hàm `examStamp()` băm chuỗi `TH2|23725521|NGUYỄN THỊ KIM XUYẾN`.
- **Kiến trúc điều hướng**:
  - `RootNavigator`: Điều hướng giữa `AuthStack` (khi chưa có token) và `MainTabs` (khi đã đăng nhập).
  - `AuthStack`: `LoginScreen` với ô nhập `phone` theo đúng biến thể số cuối 1, tạo fake token `ktxgo-23725521-472350`.
  - `ShopStack`: `HomeScreen` (lưới 2 cột) push sang `DetailScreen` nhận `{ id: string }`, presentation `card`.
  - `MainTabs`: Thứ tự 3 tab **Cửa hàng → Giỏ → Tôi** (`shopFirst`), `tabBarBadge` đồng bộ động theo tổng số lượng giỏ hàng Zustand (ẩn khi = 0).
  - `Watermark`: Nằm ở vị trí phía DƯỚI mọi màn hình chính với nội dung: `TH2 · 23725521 · NGUYỄN THỊ KIM XUYẾN · #472350`.

### Câu 2: FlashList + React Query (3 điểm)
- **FlashList lưới 2 cột**: `numColumns={2}`, `estimatedItemSize={200}`, `keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}`.
- **ProductCard**: Tách file độc lập, flexbox ổn định, hiển thị ảnh, tên 2 dòng, giá tính theo `Math.round(price * PRICE_MULTIPLIER) + toLocaleString('vi-VN') + ' đ'`, nút `+` thêm giỏ có phản hồi Haptic.
- **Debounce tìm kiếm**: Sử dụng hook `useDebouncedValue` với độ trễ `DEBOUNCE_MS = 400ms`. FlashList không bị bọc trong ScrollView dọc.
- **Axios Instance**: `src/services/apiClient.ts` cấu hình Interceptor tự động gắn header `X-Student-Id: 23725521`.
- **Ba trạng thái mạng TanStack Query**:
  1. *Đang tải*: ActivityIndicator + "Đang tải món..."
  2. *Có dữ liệu*: Hiển thị lưới FlashList 2 cột với Pull-to-refresh (`onRefresh={refetch}`).
  3. *Lỗi mạng*: Hiển thị MSSV `23725521` + "Không tải được dữ liệu món" + nút "Thử lại" gọi `refetch()`.

### Câu 3: Zustand + Location / Haptic (4 điểm)
- **cartStore**: Đầy đủ các actions `addItem`, `removeItem`, `changeQty`, `totalQuantity`, `totalAmount`. Tích hợp middleware `persist` với `@react-native-async-storage/async-storage`, key lưu trữ `ktxgo-cart-23725521` giúp dữ liệu giỏ hàng sống sót sau khi reload app.
- **Haptic phản hồi**: Cả nút `+` ở HomeScreen và nút "Thêm vào giỏ" ở DetailScreen đều gọi trigger Haptic theo đúng VARIANT `selection`.
- **CartScreen**: Hiển thị danh sách món, điều chỉnh số lượng (+/-), xoá món, khung giao hàng `Giao đến P.221`, tính phí ship tự động theo công thức B, hiển thị tổng tiền hàng.
- **useCampusLocation**: Xử lý đầy đủ 3 nhánh quyền `granted` / `denied` / `blocked`. Khi bị `blocked` cung cấp chức năng mở cài đặt hệ thống qua `Linking.openSettings()`.
- **Tính khoảng cách & Phí ship**: Tính khoảng cách đường chim bay bằng công thức Haversine tới toạ độ cổng KTX IUH. Tính phí ship tự động theo công thức B: `BASE_SHIP_FEE (9000) + Math.round(km * 1500) + 2000`. Phí ship được lưu vào store và phản ánh đồng bộ giữa tab Tôi và tab Giỏ.

---

## 3. HÌNH ẢNH MINH HỌA
- `docs/screenshot-th2-home.png`: Màn hình Cửa hàng với lưới 2 cột, watermark dòng tên MSSV ở dưới.
- `docs/screenshot-th2-cart.png`: Màn hình Giỏ hàng với danh sách món, phòng P.221, phí ship công thức B.
