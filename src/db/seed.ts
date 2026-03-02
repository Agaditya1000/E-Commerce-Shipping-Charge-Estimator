import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Customer } from './models/Customer';
import { Seller } from './models/Seller';
import { Product } from './models/Product';
import { Warehouse } from './models/Warehouse';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-shipping';

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to MongoDB for seeding: ${MONGODB_URI}`);

        // Clear existing data
        await Customer.deleteMany({});
        await Seller.deleteMany({});
        await Product.deleteMany({});
        await Warehouse.deleteMany({});
        console.log('Cleared existing data.');

        // Insert Customers
        await Customer.create([
            { customerId: 'Cust-123', name: 'Shree Kirana Store', phoneNumber: '9847000000', location: { lat: 11.232, lng: 23.445495 } },
            { customerId: 'Cust-124', name: 'Andheri Mini Mart', phoneNumber: '9101000000', location: { lat: 17.232, lng: 33.445495 } }
        ]);

        // Insert Sellers
        await Seller.create([
            { sellerId: 'Seller-101', name: 'Nestle Seller', location: { lat: 13.0, lng: 38.0 } }, // ~Near BLR Warehouse
            { sellerId: 'Seller-102', name: 'Rice Seller', location: { lat: 15.0, lng: 30.0 } },
            { sellerId: 'Seller-103', name: 'Sugar Seller', location: { lat: 11.5, lng: 27.5 } } // ~Near MUMB Warehouse
        ]);

        // Insert Products
        await Product.create([
            { productId: 'Prod-101', sellerId: 'Seller-101', name: 'Maggie 500g Packet', price: 10, weightInKg: 0.5, dimension: { length: 10, width: 10, height: 10, unit: 'cm' } },
            { productId: 'Prod-102', sellerId: 'Seller-102', name: 'Rice Bag 10Kg', price: 500, weightInKg: 10, dimension: { length: 1000, width: 800, height: 500, unit: 'cm' } },
            { productId: 'Prod-103', sellerId: 'Seller-103', name: 'Sugar Bag 25kg', price: 700, weightInKg: 25, dimension: { length: 1000, width: 900, height: 600, unit: 'cm' } }
        ]);

        // Insert Warehouses
        await Warehouse.create([
            { warehouseId: 'WH-BLR-01', name: 'BLR_Warehouse', location: { lat: 12.99999, lng: 37.923273 } },
            { warehouseId: 'WH-MUMB-01', name: 'MUMB_Warehouse', location: { lat: 11.99999, lng: 27.923273 } }
        ]);

        console.log('Database seeded successfully.');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
