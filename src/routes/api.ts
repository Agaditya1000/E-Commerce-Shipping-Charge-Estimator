import { Router } from 'express';
import { getNearestWarehouse, getShippingCharge, calculateCombinedShipping } from '../controllers/shippingController';

const router = Router();

// 1. Get the Nearest Warehouse for a Seller
router.get('/warehouse/nearest', getNearestWarehouse);

// 2. Get the Shipping Charge for a Customer from a Warehouse
router.get('/shipping-charge', getShippingCharge);

// 3. Get the Shipping Charges for a Seller and Customer
router.post('/shipping-charge/calculate', calculateCombinedShipping);

export default router;
