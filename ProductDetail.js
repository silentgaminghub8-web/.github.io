import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { sku } = useParams();
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Find product and variant
    let foundProduct = null;
    let foundVariant = null;

    for (const product of products) {
      const variant = product.variants.find(v => v.sku === sku);
      if (variant) {
        foundProduct = product;
        foundVariant = variant;
        break;
      }
    }

    if (foundProduct && foundVariant) {
      setSelectedVariant(foundVariant);
      setSelectedColor(foundVariant.color);
      setSelectedStorage(foundVariant.storage);
    }
  }, [sku]);

  if (!selectedVariant) {
    return <div>Loading...</div>;
  }

  const product = products.find(p => p.variants.some(v => v.sku === sku));
  const finalPrice = product.basePrice + selectedVariant.priceDelta;

  const colorVariants = [...new Set(product.variants.map(v => v.color))];
  const storageVariants = [...new Set(product.variants.map(v => v.storage))];

  const handleVariantChange = (color, storage) => {
    const newVariant = product.variants.find(v => 
      v.color === color && v.storage === storage
    );
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    // Show success message
    alert('Added to cart successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-[#FF9900]">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/" className="hover:text-[#FF9900]">Mobiles</Link>
        <span className="mx-2">›</span>
        <span>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="bg-white rounded-lg p-4 mb-4">
            <img
              src={selectedVariant.image}
              alt={product.title}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} ${index + 1}`}
                className="w-20 h-20 object-cover rounded border-2 border-gray-200 cursor-pointer hover:border-[#FF9900]"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 text-lg">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-blue-600 ml-2 font-semibold">
              {product.rating} ({product.reviews.toLocaleString()} ratings)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900">
              ₹{finalPrice.toLocaleString()}
            </div>
            {selectedVariant.priceDelta > 0 && (
              <div className="text-sm text-gray-500">
                <span className="line-through">
                  ₹{(product.basePrice + selectedVariant.priceDelta).toLocaleString()}
                </span>
                <span className="text-green-600 ml-2">
                  Save ₹{selectedVariant.priceDelta.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
            <div className="flex space-x-3">
              {colorVariants.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    handleVariantChange(color, selectedStorage);
                  }}
                  className={`px-4 py-2 border-2 rounded-lg font-medium ${
                    selectedColor === color
                      ? 'border-[#FF9900] bg-orange-50 text-[#FF9900]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Storage: {selectedStorage}</h3>
            <div className="flex space-x-3">
              {storageVariants.map(storage => (
                <button
                  key={storage}
                  onClick={() => {
                    setSelectedStorage(storage);
                    handleVariantChange(selectedColor, storage);
                  }}
                  className={`px-4 py-2 border-2 rounded-lg font-medium ${
                    selectedStorage === storage
                      ? 'border-[#FF9900] bg-orange-50 text-[#FF9900]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Stock */}
          <div className="mb-6">
            <label className="font-semibold mr-4">Quantity:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded px-3 py-1"
            >
              {[...Array(Math.min(10, selectedVariant.stock))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600 ml-4">
              {selectedVariant.stock > 3 ? 'In Stock' : `Only ${selectedVariant.stock} left!`}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 py-3 rounded-lg font-semibold transition-colors"
            >
              Add to Cart
            </button>
            <button className="flex-1 bg-[#FFA41C] hover:bg-[#FA8900] text-white py-3 rounded-lg font-semibold transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12 bg-white rounded-lg">
        <div className="border-b">
          <nav className="flex -mb-px">
            {['overview', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-[#FF9900] text-[#FF9900]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex border-b py-2">
                  <span className="font-medium text-gray-600 w-32 capitalize">
                    {key}:
                  </span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this product!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
