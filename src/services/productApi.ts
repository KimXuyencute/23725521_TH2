import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// L???y danh s??ch 12 m??n ??n/s???n ph???m KTXGo t??? fake store API
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products?limit=12');
  return response.data;
};

// L???y chi ti???t m??n theo id
export const getProductById = async (id: string | number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

