import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load from localStorage
    const savedCart = localStorage.getItem('amazon_cart');
    const savedOrders = localStorage.getItem('amazon_orders');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('amazon_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('amazon_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, variant, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.sku === variant.sku && item.productId === product.id
      );
      
      if (existing) {
        return prev.map(item =>
          item.sku === variant.sku 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, {
        productId: product.id,
        sku: variant.sku,
        title: product.title,
        color: variant.color,
        storage: variant.storage,
        image: variant.image,
        price: product.basePrice + variant.priceDelta,
        quantity,
        stock: variant.stock
      }];
    });
  };

  const removeFromCart = (sku) => {
    setCart(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart(prev => prev.map(item =>
      item.sku === sku ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      orderId: `ORD${Date.now()}_${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
      placedAt: new Date().toISOString(),
      status: 'Placed',
      timeline: [
        { status: 'Placed', timestamp: new Date().toISOString() }
      ]
    };
    
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status,
          timeline: [
            ...order.timeline,
            { status, timestamp: new Date().toISOString() }
          ]
        };
      }
      return order;
    }));
  };

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
};
