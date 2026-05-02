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
        name: 'Lindt Excellence 70% Dark',
        description: 'Rich Belgian dark chocolate with a velvety smooth finish. Made with the finest cacao for the ultimate chocolate experience.',
        price: 450,
        category: 'Dark Chocolates',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
        isFeatured: true,
      },
      {
        name: 'Godiva Luxury Gift Hamper',
        description: 'An exquisite assortment of handcrafted chocolates presented in an elegant gold-embossed gift box. Perfect for special occasions.',
        price: 4500,
        category: 'Gift Hamper',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80',
        isFeatured: true,
      },
      {
        name: 'Venchi Gold Pralines',
        description: 'Authentic Italian pralines infused with edible gold flakes. A truly luxurious chocolate experience.',
        price: 1200,
        category: 'Assorted',
        stock: 10,
        imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500&q=80',
        isFeatured: true,
      },
      {
        name: 'Milka Bubbly Milk Chocolate',
        description: 'Delicate milk chocolate with an airy, bubbly texture. Made with Alpine milk for that signature smooth taste.',
        price: 250,
        category: 'Milk Chocolates',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Toblerone White with Honey',
        description: 'The classic triangular white chocolate with honey and almond nougat from Switzerland.',
        price: 350,
        category: 'White Chocolates',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Rhine Valley Sugar Free Dark',
        description: 'Premium sugar-free dark chocolate for the health-conscious connoisseur. Zero added sugar, maximum flavor.',
        price: 550,
        category: 'Sugar Free',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Hazelnut Crunch Collection',
        description: 'Crunchy hazelnut pieces enrobed in smooth milk chocolate. A classic combination.',
        price: 850,
        category: 'Milk Chocolates',
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80',
        isFeatured: false,
      },
      {
        name: 'Luxury Valentine Hearts',
        description: 'Beautifully crafted heart-shaped chocolates in a luxurious red velvet box.',
        price: 1800,
        category: 'Gift Hamper',
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