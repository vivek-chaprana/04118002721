import { useCallback, useEffect, useState } from "react";

type Availability = "yes" | "out-of-stock";

export type Product = {
  productName: string;
  price: number;
  rating: number;
  discount: number;
  availability: Availability;
  company: string;
  id: string;
};

export interface UseProductsParams {
  n?: number;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "rating" | "discount" | "productName" | "availability";
  order?: "asc" | "desc";
  cat?: string;
}

export function useProducts(params: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(
    async function () {
      if (loading) return;

      const {
        n = 10,
        page = 1,
        minPrice = 1,
        maxPrice = 100000,
        sortBy = "price",
        order = "asc",
        cat = "Laptop",
      } = params;

      try {
        const url = `http://localhost:3000/categories/${cat}/products`;
        const searchParams = new URLSearchParams({
          n: n.toString(),
          page: page.toString(),
          minPrice: minPrice.toString(),
          maxPrice: maxPrice.toString(),
          sortBy,
          order,
        });
        const response = await fetch(url + "?" + searchParams.toString());
        const { products } = (await response.json()) ?? { products: [] };
        setProducts(products ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [params, loading]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading };
}

export function useProduct(cat: string, id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;

    (async function () {
      setLoading(true);
      try {
        const url = `http://localhost:3000/categories/${cat}/products/${id}`;

        const response = await fetch(url);
        const product = (await response.json()) ?? {};

        setProduct(product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [loading, cat, id]);

  return { product, loading };
}
