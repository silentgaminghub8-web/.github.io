import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Account from './pages/Account';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import './styles/App.css';

function App() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
    }
  }, []);

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode} />
            <main className="min-h-screen bg-gray-100 pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:sku" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
