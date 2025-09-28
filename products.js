export const products = [
  {
    id: "prod_ip15",
    title: "iPhone 15 - Great India Edition",
    category: "Mobiles",
    basePrice: 79999,
    rating: 4.6,
    reviews: 1247,
    description: "Latest iPhone with advanced features and camera",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500"
    ],
    variants: [
      {
        sku: "ip15-64-blk",
        color: "Black",
        storage: "64GB",
        priceDelta: 0,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        stock: 5
      },
      {
        sku: "ip15-128-blk",
        color: "Black",
        storage: "128GB",
        priceDelta: 10000,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        stock: 3
      },
      {
        sku: "ip15-64-red",
        color: "Red",
        storage: "64GB",
        priceDelta: 3000,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
        stock: 2
      },
      {
        sku: "ip15-128-red",
        color: "Red",
        storage: "128GB",
        priceDelta: 13000,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
        stock: 1
      }
    ],
    specs: {
      display: "6.1-inch Super Retina XDR",
      battery: "Up to 20 hours video playback",
      camera: "48MP Main camera with 2x Telephoto",
      processor: "A16 Bionic chip"
    }
  },
  {
    id: "prod_samsung_s24",
    title: "Samsung Galaxy S24",
    category: "Mobiles",
    basePrice: 69999,
    rating: 4.4,
    reviews: 892,
    description: "Powerful Android smartphone with excellent camera",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"
    ],
    variants: [
      {
        sku: "s24-128-gray",
        color: "Gray",
        storage: "128GB",
        priceDelta: 0,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
        stock: 8
      },
      {
        sku: "s24-256-gray",
        color: "Gray",
        storage: "256GB",
        priceDelta: 8000,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
        stock: 4
      }
    ],
    specs: {
      display: "6.2-inch Dynamic AMOLED 2X",
      battery: "4000mAh",
      camera: "50MP+10MP+12MP Triple camera",
      processor: "Snapdragon 8 Gen 3"
    }
  }
  // Add other products similarly...
];

export const userData = {
  id: "user_rose_01",
  name: "Rose",
  email: "rose@example.com",
  defaultAddress: "Delhi, Chandni Chowk, Gali No.5",
  cards: [
    {
      alias: "Rose",
      brand: "VISA",
      last4: "4242",
      expiry: "12/27",
      masked: "•••• 4242"
    }
  ]
};
