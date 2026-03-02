import { DistanceService } from '../src/services/distanceService';
import { TransportStrategyContext } from '../src/patterns/TransportStrategy';
import { DeliverySpeedFactory } from '../src/patterns/DeliverySpeedFactory';

describe('Distance Service', () => {
    it('should calculate distance correctly between BLR and MUMB', () => {
        const blr = { lat: 12.99999, lng: 37.923273 };
        const mumb = { lat: 11.99999, lng: 27.923273 };
        const distance = DistanceService.calculateDistance(blr, mumb);

        expect(distance).toBeGreaterThan(1000); // Rough check
        expect(distance).toBeLessThan(1200);
    });
});

describe('Strategy Pattern (Transport)', () => {
    it('should select Aeroplane and calculate cost for >= 500km', () => {
        const context = new TransportStrategyContext(600);
        expect(context.getTransportMode()).toBe('Aeroplane');
        // 600km * 5kg * 1 Rs = 3000 Rs
        expect(context.calculateShippingCharge(600, 5)).toBe(3000);
    });

    it('should select Truck and calculate cost for 100km to 499km', () => {
        const context = new TransportStrategyContext(200);
        expect(context.getTransportMode()).toBe('Truck');
        // 200km * 5kg * 2 Rs = 2000 Rs
        expect(context.calculateShippingCharge(200, 5)).toBe(2000);
    });

    it('should select Mini Van and calculate cost for < 100km', () => {
        const context = new TransportStrategyContext(50);
        expect(context.getTransportMode()).toBe('Mini Van');
        // 50km * 5kg * 3 Rs = 750 Rs
        expect(context.calculateShippingCharge(50, 5)).toBe(750);
    });
});

describe('Factory Pattern (Delivery Speed Pricing)', () => {
    it('should calculate Standard delivery cost correctly', () => {
        const pricing = DeliverySpeedFactory.getPricingStrategy('standard');
        expect(pricing.getSpeedName()).toBe('standard');

        // Base shipping = 100, Weight = 10
        // Standard = 10 (courier) + 100 (base) = 110
        expect(pricing.calculateTotalCharge(100, 10)).toBe(110);
    });

    it('should calculate Express delivery cost correctly', () => {
        const pricing = DeliverySpeedFactory.getPricingStrategy('express');
        expect(pricing.getSpeedName()).toBe('express');

        // Base shipping = 100, Weight = 10
        // Express = 10 (courier) + (1.2 * 10) (extra) + 100 (base) = 10 + 12 + 100 = 122
        expect(pricing.calculateTotalCharge(100, 10)).toBe(122);
    });

    it('should throw error on invalid speed', () => {
        expect(() => {
            // @ts-ignore
            DeliverySpeedFactory.getPricingStrategy('invalid');
        }).toThrow();
    });
});
