import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Cargar carrito desde localStorage al iniciar
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getItemId = (item) => item._id || item.id;

  const addToCart = (producto) => {
    setCart((prevCart) => {
      const id = getItemId(producto);
      const existingProduct = prevCart.find((item) => getItemId(item) === id);

      if (existingProduct) {
        return prevCart.map((item) =>
          getItemId(item) === id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...producto, _id: id, cantidad: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => getItemId(item) !== productId));
  };

  const updateQuantity = (productId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        getItemId(item) === productId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

