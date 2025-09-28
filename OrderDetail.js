import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useCart();
  
  const [order, setOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const foundOrder = orders.find(o => o.orderId === orderId);
    setOrder(foundOrder);
  }, [orderId, orders]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  const placedTime = new Date(order.placedAt);
  const timeSincePlaced = (currentTime - placedTime) / 1000 / 60; // minutes

  // Auto-update status based on time (demo mode)
  useEffect(() => {
    if (order.status === 'Placed' && timeSincePlaced >= 3) {
      updateOrderStatus(orderId, 'Shipped');
    } else if (order.status === 'Shipped' && timeSincePlaced >= 5) {
      updateOrderStatus(orderId, 'Delivered');
    }
  }, [timeSincePlaced, order.status, orderId, updateOrderStatus]);

  const getProgressPercentage = () => {
    switch (order.status) {
      case 'Placed': return 25;
      case 'Shipped': return 50;
      case 'Out for delivery': return 75;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  const timelineSteps = [
    { status: 'Placed', label: 'Order Placed', time: placedTime },
    { status: 'Shipped', label: 'Shipped', time: timeSincePlaced >= 3 ? new Date(placedTime.getTime() + 3 * 60 * 1000) : null },
    { status: 'Out for delivery', label: 'Out for Delivery', time: timeSincePlaced >= 4 ? new Date(placedTime.getTime() + 4 * 60 * 1000) : null },
    { status: 'Delivered', label: 'Delivered', time: timeSincePlaced >= 5 ? new Date(placedTime.getTime() + 5 * 60 * 1000) : null }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Order Details</h1>
      <p className="text-gray-600 mb-8">Order ID: {order.orderId}</p>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Order Status: {order.status}</span>
          <span className="text-sm text-gray-500">
            Placed on {placedTime.toLocaleDateString()} at {placedTime.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-[#FF9900] h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        {/* Timeline */}
        <div className="flex justify-between relative">
          {timelineSteps.map((step, index) => {
            const isCompleted = order.timeline.some(t => t.status === step.status);
            const isCurrent = order.status === step.status;
            
            return (
              <div key={step.status} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted
                      ? 'bg-[#FF9900] text-white'
                      : isCurrent
                      ? 'bg-[#FF9900] text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isCompleted || isCurrent ? '✓' : index + 1}
                </div>
                <div className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-[#FF9900]' : 'text-gray-500'}`}>
                  {step.label}
                </div>
                {step.time && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Connecting line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-10"></div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
        {order.items.map(item => (
          <div key={item.sku} className="flex items-center py-4 border-b last:border-b-0">
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

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <div className="text-gray-700">
            <div className="font-semibold">Rose</div>
            <div>{order.address}</div>
            <div className="mt-2">Phone: ••••••••••</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{order.tax.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{order.total.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Paid with {order.payment.cardAlias} {order.payment.masked}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
