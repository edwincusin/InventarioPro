import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { api } from "../config/api";
import { Alert } from "react-native";

export type Producto = {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    fotoBase64: string | null;
    createdAt: string;
}

type ProductoContextType = {
    productos: Producto[];
    fetchProductos: () => void;
    addProducto: (producto: Omit<Producto, 'id' | 'createdAt'>) => Promise<boolean>;
    updateProducto: (id: number, productoModificado: Omit<Producto, 'id' | 'createdAt'>) => Promise<boolean>;
    deleteProducto: (id: number) => void;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export function ProductoProvider({ children }: { children: ReactNode }) {

    const [productos, setProductos] = useState<Producto[]>([]);

    //METODO GET 
    const fetchProductos = async () => {
        try {
            const response = await api.get('/inventario/productos');
            setProductos(response.data);

        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    }
    // se ejecuta una sola vez
    useEffect(() => {
        fetchProductos();
    }, []);

    // METODO POST
    const addProducto = async (producto: Omit<Producto, 'id' | 'createdAt'>) => {
        try {
            const response = await api.post('/inventario/productos', producto);
            setProductos((prev) => [response.data, ...prev]);
            return true;
        } catch (error) {
            Alert.alert("Error", "No se pudo crear el producto");
            return false;
        }
    };

    // METODO DELETE
    const deleteProducto = async (id: number) => {
        try {
            await api.delete(`/inventario/productos/${id}`);
            setProductos((prev) => prev.filter((p) => p.id !== id));
            return true;
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el producto");
            return false;
        }
    };

    // METODO PUT
    const updateProducto = async (id: number, producto: Partial<Omit<Producto, 'id' | 'createdAt'>>) => {
        try {
            const response = await api.put(`/inventario/productos/${id}`, producto);
            setProductos((prev) =>
                prev.map((p) => (p.id === id ? response.data : p))
            );
            return true;
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el producto");
            return false;
        }
    };

    return <ProductoContext.Provider value={{ addProducto, deleteProducto, fetchProductos, productos, updateProducto }}>
        {children}
    </ProductoContext.Provider>

} export function useContacts() {
    const context = useContext(ProductoContext);
    if (!context) {
        throw new Error("Debe usarse dentro de un producto provider")
    }
    return context;
}