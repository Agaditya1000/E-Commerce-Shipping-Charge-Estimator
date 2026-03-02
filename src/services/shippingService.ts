import { TransportStrategyContext } from '../patterns/TransportStrategy';
import { DeliverySpeedFactory } from '../patterns/DeliverySpeedFactory';

export class ShippingService {
    /**
     * Calculates the final shipping charge based on distance, weight, and delivery speed.
     */
    static calculateShippingCharge(distanceInKm: number, weightInKg: number, deliverySpeed: 'standard' | 'express'): { totalCharge: number, transportMode: string } {
        // 1. Determine Transport Strategy and Base Cost (Strategy Pattern)
        const transportContext = new TransportStrategyContext(distanceInKm);
        const transportMode = transportContext.getTransportMode();
        const baseShippingCharge = transportContext.calculateShippingCharge(distanceInKm, weightInKg);

        // 2. Determine Delivery Speed Pricing (Factory Pattern)
        const pricingStrategy = DeliverySpeedFactory.getPricingStrategy(deliverySpeed);

        // 3. Calculate Final Total Charge
        const totalCharge = pricingStrategy.calculateTotalCharge(baseShippingCharge, weightInKg);

        return {
            totalCharge,
            transportMode
        };
    }
}
