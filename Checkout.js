import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Checkout = () => {
  const { cart, getCartTotal, clearCart, addOrder } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('saved-card');
  const [cvv, setCvv] = useState('');
  const [showCvvModal, setShowCvvModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping for demo
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    if (paymentMethod === 'saved-card') {
      setShowCvvModal(true);
      return;
    }
    
    await processPayment();
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (paymentMethod === 'saved-card' && cvv !== '999') {
      alert('Invalid CVV. Demo CVV is 999');
      setIsProcessing(false);
      return;
    }

    // Create order
    const order = addOrder({
      items: cart,
      subtotal,
      shipping,
      tax,
      total,
      payment: {
        method: paymentMethod,
        cardAlias: paymentMethod === 'saved-card' ? 'Rose' : 'New Card',
        masked: '•••• 4242'
      },
      address: user.defaultAddress
    });

    clearCart();
    setIsProcessing(false);
    navigate(`/order-confirmation/${order.orderId}`);
  };

  const handleCvvSubmit = () => {
    if (cvv === '999') {
      setShowCvvModal(false);
      processPayment();
    } else {
      alert('Invalid CVV. Demo CVV is 999');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-[#FF9900] text-white px-6 py-2 rounded hover:bg-[#e68900]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <div className="border-2 border-[#FF9900] rounded-lg p-4 bg-orange-50">
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-600">{user.defaultAddress}</div>
              <div className="text-gray-600">Phone: ••••••••••</div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              {/* Saved Card */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="saved-card"
                  checked={paymentMethod === 'saved-card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold">Saved Card</div>
                  <div className="text-gray-600">Rose •••• 4242</div>
                  <div className="text-sm text-gray-500">Expires 12/27</div>
                </div>
                <div className="text-[#FF9900]">VISA</div>
              </label>

              {/* Other payment methods */}
              {['new-card', 'netbanking', 'upi', 'wallet', 'cod'].map(method => (
                <label key={method} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="font-semibold capitalize">
                    {method === 'new-card' && 'Credit/Debit Card'}
                    {method === 'netbanking' && 'Net Banking'}
                    {method === 'upi' && 'UPI'}
                    {method === 'wallet' && 'Amazon Pay Wallet'}
                    {method === 'cod' && 'Cash on Delivery'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            {cart.map(item => (
              <div key={item.sku} className="flex items-center py-4 border-b">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-600">
                    {item.color} • {item.storage}
                  </div>
                  <div className="text-sm">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>₹{tax.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#FF9900] hover:bg-[#e68900] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            By completing your purchase you agree to our Terms of Service
          </div>
        </div>
      </div>

      {/* CVV Modal */}
      {showCvvModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Enter CVV</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter the CVV for your card ending in 4242
            </p>
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="Enter CVV"
              className="w-full p-3 border rounded-lg mb-4"
              maxLength={3}
            />
            <div className="text-xs text-gray-500 mb-4">
              Demo CVV: <strong>999</strong>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCvvModal(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCvvSubmit}
                className="flex-1 bg-[#FF9900] text-white py-2 rounded-lg hover:bg-[#e68900]"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
