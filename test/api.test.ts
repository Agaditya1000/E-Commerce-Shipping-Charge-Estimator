import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { Customer } from '../src/db/models/Customer';
import { Seller } from '../src/db/models/Seller';
import { Product } from '../src/db/models/Product';
import { Warehouse } from '../src/db/models/Warehouse';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Seed Data for tests
    await Customer.create([
        { customerId: 'Cust-123', name: 'Shree Kirana Store', phoneNumber: '9847000000', location: { lat: 11.0, lng: 20.0 } }
    ]);

    await Seller.create([
        { sellerId: 'Seller-101', name: 'Nestle Seller', location: { lat: 12.0, lng: 30.0 } }
    ]);

    await Product.create([
        { productId: 'Prod-101', sellerId: 'Seller-101', name: 'Maggie 500g Packet', price: 10, weightInKg: 0.5, dimension: { length: 10, width: 10, height: 10, unit: 'cm' } }
    ]);

    await Warehouse.create([
        { warehouseId: 'WH-BLR-01', name: 'BLR_Warehouse', location: { lat: 12.5, lng: 35.0 } }, // ~550km from seller
        { warehouseId: 'WH-MUMB-01', name: 'MUMB_Warehouse', location: { lat: 12.1, lng: 30.2 } }  // closest to seller
    ]);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Shipping Charge API Endpoints', () => {

    describe('GET /api/v1/warehouse/nearest', () => {
        it('should return the nearest warehouse for a seller', async () => {
            const res = await request(app)
                .get('/api/v1/warehouse/nearest')
                .query({ sellerId: 'Seller-101', productId: 'Prod-101' });

            expect(res.status).toBe(200);
            expect(res.body.warehouseId).toBe('WH-MUMB-01');
        });

        it('should return 400 if parameters are missing', async () => {
            const res = await request(app).get('/api/v1/warehouse/nearest');
            expect(res.status).toBe(400);
        });

        it('should return 404 if seller does not exist', async () => {
            const res = await request(app)
                .get('/api/v1/warehouse/nearest')
                .query({ sellerId: 'Invalid', productId: 'Prod-101' });
            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/v1/shipping-charge', () => {
        it('should return 200 and calculate standard shipping charge', async () => {
            // Warehouse WH-MUMB-01 to Customer Cust-123 distance is roughly > 1000km
            // Weight = 0.5kg
            // Transport = Aeroplane (>500km) -> 1 Rs/km/kg => ~1000 * 0.5 * 1 = 500
            // Standard = 10 + 500 = 510
            const res = await request(app)
                .get('/api/v1/shipping-charge')
                .query({ warehouseId: 'WH-MUMB-01', customerId: 'Cust-123', deliverySpeed: 'standard', productId: 'Prod-101' });

            expect(res.status).toBe(200);
            expect(res.body.shippingCharge).toBeGreaterThan(500); // Sanity check based on formula
        });
    });

    describe('POST /api/v1/shipping-charge/calculate', () => {
        it('should calculate combined shipping', async () => {
            const res = await request(app)
                .post('/api/v1/shipping-charge/calculate')
                .send({
                    sellerId: 'Seller-101',
                    customerId: 'Cust-123',
                    deliverySpeed: 'express',
                    productId: 'Prod-101'
                });

            expect(res.status).toBe(200);
            expect(res.body.nearestWarehouse.warehouseId).toBe('WH-MUMB-01');
            expect(res.body.shippingCharge).toBeGreaterThan(500);
        });
    });

});
