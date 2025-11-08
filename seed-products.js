import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import { Product } from "./src/models/Product.model.js";
import { User } from "./src/models/user.model.js";

const demoProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life. Crystal clear sound quality with deep bass and comfortable ear cushions.",
    price: 79.99,
    category: "Electronics",
    stock: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    rating: 4.5,
    numReviews: 128
  },
  {
    name: "Smart Watch Series 5",
    description: "Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance. Compatible with iOS and Android.",
    price: 299.99,
    category: "Electronics",
    stock: 30,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    rating: 4.7,
    numReviews: 256
  },
  {
    name: "Leather Laptop Bag",
    description: "Professional genuine leather laptop bag with multiple compartments. Fits laptops up to 15.6 inches. Durable and stylish.",
    price: 89.99,
    category: "Accessories",
    stock: 45,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    rating: 4.3,
    numReviews: 89
  },
  {
    name: "Portable Power Bank 20000mAh",
    description: "High-capacity portable charger with fast charging support. Charge multiple devices simultaneously with dual USB ports.",
    price: 34.99,
    category: "Electronics",
    stock: 100,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    rating: 4.6,
    numReviews: 342
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with customizable keys. Cherry MX switches for ultimate gaming performance.",
    price: 129.99,
    category: "Gaming",
    stock: 25,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    rating: 4.8,
    numReviews: 178
  },
  {
    name: "4K Webcam Pro",
    description: "Professional 4K webcam with autofocus and built-in microphone. Perfect for streaming and video conferences.",
    price: 149.99,
    category: "Electronics",
    stock: 35,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500",
    rating: 4.4,
    numReviews: 95
  },
  {
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic office chair with lumbar support and adjustable armrests. Breathable mesh back for all-day comfort.",
    price: 249.99,
    category: "Furniture",
    stock: 20,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500",
    rating: 4.6,
    numReviews: 156
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.",
    price: 24.99,
    category: "Accessories",
    stock: 150,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    rating: 4.7,
    numReviews: 423
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with 16000 DPI sensor. Customizable RGB lighting and programmable buttons.",
    price: 69.99,
    category: "Gaming",
    stock: 60,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    rating: 4.5,
    numReviews: 234
  },
  {
    name: "USB-C Hub 7-in-1",
    description: "Multiport USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Perfect for laptops and tablets.",
    price: 44.99,
    category: "Electronics",
    stock: 80,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
    rating: 4.3,
    numReviews: 167
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra thick non-slip yoga mat with carrying strap. Eco-friendly TPE material, perfect for yoga and pilates.",
    price: 39.99,
    category: "Sports",
    stock: 70,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    rating: 4.6,
    numReviews: 289
  },
  {
    name: "LED Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.",
    price: 49.99,
    category: "Home",
    stock: 55,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    rating: 4.4,
    numReviews: 145
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find a seller user (or create one if none exists)
    let seller = await User.findOne({ role: "seller" });
    
    if (!seller) {
      console.log("⚠️  No seller found. Creating a demo seller account...");
      seller = await User.create({
        username: "demoseller",
        email: "seller@demo.com",
        password: "password123",
        role: "seller",
        avatar: "https://via.placeholder.com/150"
      });
      console.log("✅ Demo seller created");
    }

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log("🗑️  Cleared existing products");

    // Add seller ID to all products
    const productsWithSeller = demoProducts.map(product => ({
      ...product,
      seller: seller._id
    }));

    // Insert products
    const insertedProducts = await Product.insertMany(productsWithSeller);
    console.log(`✅ Successfully added ${insertedProducts.length} demo products`);

    // Display summary
    console.log("\n📦 Products added:");
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.stock} in stock)`);
    });

    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
