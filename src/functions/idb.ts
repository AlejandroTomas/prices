// db.js
import { Product } from "@/types";
import { openDB } from "idb";

const DB_NAME = "ProductDB";
const DB_VERSION = 1;
const STORE_NAME = "list";

// Inicializar base de datos
export const initDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_id" });
      }
    },
  });
};

// Agregar producto
export const addProductToDB = async (product: Product) => {
  const db = await initDB();
  await db.put(STORE_NAME, product);
};

// Obtener productos
export const getAllProductsFromDB = async (): Promise<Product[]> => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

// Actualizar producto
export const updateProductInDB = async (product: Product) => {
  const db = await initDB();
  await db.put(STORE_NAME, product);
};

// Eliminar productos
export const deleteProductFromDB = async (id: number) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
};
