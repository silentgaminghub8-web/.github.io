import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#FF9900] to-[#ff6b00] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Great India Festival
          </h1>
          <p className="text-xl mb-8">Amazing deals on latest smartphones</p>
          <Link
            to="/"
            className="bg-white text-[#FF9900] px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto pb-2">
            {['Mobiles', 'Electronics', 'Fashion', 'Grocery', 'Home', 'Beauty'].map((category) => (
              <div key={category} className="flex flex-col items-center cursor-pointer hover:text-[#FF9900] min-w-[60px]">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <span className="text-xl">📱</span>
                </div>
                <span className="text-sm font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Deals of the Day</h2>
          <button className="text-[#FF9900] font-semibold hover:underline">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant={product.variants[0]} />
          ))}
        </div>
      </section>

      {/* Recommended for You */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant={product.variants[0]} />
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product, variant }) => {
  const finalPrice = product.basePrice + variant.priceDelta;
  const discount = Math.round((variant.priceDelta / (finalPrice + variant.priceDelta)) * 100);

  return (
    <Link 
      to={`/product/${variant.sku}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 group"
    >
      <div className="relative mb-4">
        <img
          src={variant.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            {discount}% off
          </span>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
        {product.title}
      </h3>
      
      <div className="flex items-center mb-2">
        <div className="flex text-yellow-400">
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
        </div>
        <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
        {variant.priceDelta > 0 && (
          <span className="text-sm text-gray-500 line-through ml-2">
            ₹{(product.basePrice + variant.priceDelta).toLocaleString()}
          </span>
        )}
      </div>
      
      <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 py-2 rounded-full font-semibold transition-colors">
        Add to Cart
      </button>
    </Link>
  );
};

export default Home;
