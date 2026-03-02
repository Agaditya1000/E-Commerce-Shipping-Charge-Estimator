import { Request, Response } from 'express';
import { z } from 'zod';
import { Seller } from '../db/models/Seller';
import { Product } from '../db/models/Product';
import { Customer } from '../db/models/Customer';
import { WarehouseService } from '../services/warehouseService';
import { ShippingService } from '../services/shippingService';
import { DistanceService } from '../services/distanceService';
import { Warehouse } from '../db/models/Warehouse';

// Validation Schemas
const nearestWarehouseSchema = z.object({
    sellerId: z.string().trim().min(1, 'sellerId is required'),
    productId: z.string().trim().min(1, 'productId is required')
});

const calculateShippingSchema = z.object({
    warehouseId: z.string().trim().min(1, 'warehouseId is required'),
    customerId: z.string().trim().min(1, 'customerId is required'),
    deliverySpeed: z.enum(['standard', 'express']),
    productId: z.string().trim().min(1, 'productId is required')
});

const calculateCombinedShippingSchema = z.object({
    sellerId: z.string().trim().min(1, 'sellerId is required'),
    customerId: z.string().trim().min(1, 'customerId is required'),
    deliverySpeed: z.enum(['standard', 'express']),
    productId: z.string().trim().min(1, 'productId is required')
});

export const getNearestWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sellerId, productId } = nearestWarehouseSchema.parse(req.query);

        const seller = await Seller.findOne({ sellerId });
        if (!seller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        const product = await Product.findOne({ productId, sellerId: seller.sellerId });
        if (!product) {
            res.status(404).json({ error: 'Product not found for the given seller' });
            return;
        }

        const nearestInfo = await WarehouseService.findNearestWarehouse(seller.location);

        if (!nearestInfo) {
            res.status(404).json({ error: 'No warehouses available' });
            return;
        }

        res.json({
            warehouseId: nearestInfo.warehouse.warehouseId,
            warehouseLocation: nearestInfo.warehouse.location
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const getShippingCharge = async (req: Request, res: Response): Promise<void> => {
    try {
        const { warehouseId, customerId, deliverySpeed, productId } = calculateShippingSchema.parse(req.query);

        const warehouse = await Warehouse.findOne({ warehouseId });
        if (!warehouse) {
            res.status(404).json({ error: 'Warehouse not found' });
            return;
        }

        const customer = await Customer.findOne({ customerId });
        if (!customer) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }

        const product = await Product.findOne({ productId });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        const distanceInKm = DistanceService.calculateDistance(warehouse.location, customer.location);
        const shippingInfo = ShippingService.calculateShippingCharge(distanceInKm, product.weightInKg, deliverySpeed as 'standard' | 'express');

        res.json({
            shippingCharge: Number(shippingInfo.totalCharge.toFixed(2))
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export const calculateCombinedShipping = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sellerId, customerId, deliverySpeed, productId } = calculateCombinedShippingSchema.parse(req.body);

        const seller = await Seller.findOne({ sellerId });
        if (!seller) {
            res.status(404).json({ error: 'Seller not found' });
            return;
        }

        const customer = await Customer.findOne({ customerId });
        if (!customer) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }

        const product = await Product.findOne({ productId, sellerId: seller.sellerId });
        if (!product) {
            res.status(404).json({ error: 'Product not found for the given seller' });
            return;
        }

        const nearestInfo = await WarehouseService.findNearestWarehouse(seller.location);
        if (!nearestInfo) {
            res.status(404).json({ error: 'No warehouses available' });
            return;
        }

        const distanceInKm = DistanceService.calculateDistance(nearestInfo.warehouse.location, customer.location);
        const shippingInfo = ShippingService.calculateShippingCharge(distanceInKm, product.weightInKg, deliverySpeed as 'standard' | 'express');

        res.json({
            shippingCharge: Number(shippingInfo.totalCharge.toFixed(2)),
            nearestWarehouse: {
                warehouseId: nearestInfo.warehouse.warehouseId,
                warehouseLocation: nearestInfo.warehouse.location
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
