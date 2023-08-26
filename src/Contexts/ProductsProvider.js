import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext();

export function useProducts() {
  return useContext(ProductsContext);
}

export default function ProductsContextProvider({children}) {
  const [products, setProducts] = useState([]);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('products');

      if (data === null) {
        await AsyncStorage.setItem('products', JSON.stringify([]));
      }

      const parsedData = JSON.parse(data);

      setProducts(parsedData);
    } catch(error) {
      console.log(error);
    }
  }

  // useEffect(() => {loadData()}, []);

  return (
    <ProductsContext.Provider value={[products, setProducts]}>
      {children}
    </ProductsContext.Provider>
  );
}