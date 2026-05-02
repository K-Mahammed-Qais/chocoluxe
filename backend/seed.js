const { sequelize, User, Product, Order, OrderItem, ShippingAddress } = require('./models');
require('dotenv').config();

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected...');

    // Sync models and clear existing data
    await sequelize.sync({ force: true });
    console.log('Database tables synced and cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@chocoluxe.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created');

    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: 'Belgian Dark Truffles',
        description: 'Rich Belgian dark chocolate truffles with a velvety smooth ganache center. Made with 70% cacao for the ultimate chocolate experience.',
        price: 34.99,
        category: 'Imported',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
        isFeatured: true,
      },
      {
        name: 'Luxury Gift Collection',
        description: 'An exquisite assortment of 24 handcrafted chocolates presented in an elegant gold-embossed gift box. Perfect for special occasions.',
        price: 89.99,
        category: 'Gift Boxes',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80',
        isFeatured: true,
      },
      {
        name: 'Swiss Gold Pralines',
        description: 'Authentic Swiss pralines infused with edible gold flakes. A truly luxurious chocolate experience for the discerning palate.',
        price: 59.99,
        category: 'Premium',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500&q=80',
        isFeatured: true,
      },
      {
        name: 'French Macaron Chocolates',
        description: 'Delicate French macarons filled with rich chocolate ganache. Available in assorted flavors including raspberry, pistachio, and vanilla.',
        price: 44.99,
        category: 'Imported',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Artisan Truffle Box',
        description: 'A curated selection of 12 artisan truffles featuring unique flavor combinations like sea salt caramel, champagne, and espresso.',
        price: 64.99,
        category: 'Gift Boxes',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Single Origin Ecuador',
        description: 'Premium single-origin chocolate bar made from rare Ecuadorian cacao beans. Notes of tropical fruit and floral undertones.',
        price: 24.99,
        category: 'Premium',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Hazelnut Crunch Collection',
        description: 'Crunchy hazelnut pieces enrobed in smooth milk chocolate. A classic combination that chocolate lovers adore.',
        price: 29.99,
        category: 'Imported',
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Valentine Hearts Box',
        description: 'Beautifully crafted heart-shaped chocolates in a luxurious red velvet box. The perfect romantic gift for your loved one.',
        price: 49.99,
        category: 'Gift Boxes',
        stock: 2,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
        isFeatured: true,
      },
    ]);
    console.log('Sample products created');

    console.log('\nSeed completed successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@chocoluxe.com');
    console.log('Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();