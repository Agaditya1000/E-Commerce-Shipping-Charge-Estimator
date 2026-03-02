// DeliverySpeedFactory.ts

export interface IDeliverySpeedPricing {
    calculateTotalCharge(baseShippingCharge: number, weightInKg: number): number;
    getSpeedName(): string;
}

export class StandardDeliveryPricing implements IDeliverySpeedPricing {
    calculateTotalCharge(baseShippingCharge: number, weightInKg: number): number {
        // Standard: Rs 10 standard courier charge + calculated shipping charge on items
        return 10 + baseShippingCharge;
    }

    getSpeedName(): string {
        return 'standard';
    }
}

export class ExpressDeliveryPricing implements IDeliverySpeedPricing {
    calculateTotalCharge(baseShippingCharge: number, weightInKg: number): number {
        // Express: Rs 10 standard courier charge + Rs 1.2 per Kg Extra for express charge + calculated shipping charge
        return 10 + (1.2 * weightInKg) + baseShippingCharge;
    }

    getSpeedName(): string {
        return 'express';
    }
}

export class DeliverySpeedFactory {
    static getPricingStrategy(speed: 'standard' | 'express'): IDeliverySpeedPricing {
        if (speed === 'express') {
            return new ExpressDeliveryPricing();
        } else if (speed === 'standard') {
            return new StandardDeliveryPricing();
        } else {
            throw new Error(`Unsupported delivery speed: ${speed}`);
        }
    }
}
