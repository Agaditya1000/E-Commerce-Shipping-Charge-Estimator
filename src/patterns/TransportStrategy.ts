// TransportStrategy.ts

export interface ITransportStrategy {
    calculateCost(distanceInKm: number, weightInKg: number): number;
    getModeName(): string;
}

export class AeroplaneTransport implements ITransportStrategy {
    calculateCost(distanceInKm: number, weightInKg: number): number {
        // 500Km+: 1 Rs per km per kg
        return distanceInKm * weightInKg * 1;
    }

    getModeName(): string {
        return 'Aeroplane';
    }
}

export class TruckTransport implements ITransportStrategy {
    calculateCost(distanceInKm: number, weightInKg: number): number {
        // 100Km+ to <500Km: 2 Rs per km per kg
        return distanceInKm * weightInKg * 2;
    }

    getModeName(): string {
        return 'Truck';
    }
}

export class MiniVanTransport implements ITransportStrategy {
    calculateCost(distanceInKm: number, weightInKg: number): number {
        // 0-100Km: 3 Rs per km per kg
        return distanceInKm * weightInKg * 3;
    }

    getModeName(): string {
        return 'Mini Van';
    }
}

export class TransportStrategyContext {
    private strategy: ITransportStrategy;

    constructor(distanceInKm: number) {
        this.strategy = this.determineStrategy(distanceInKm);
    }

    private determineStrategy(distanceInKm: number): ITransportStrategy {
        if (distanceInKm >= 500) {
            return new AeroplaneTransport();
        } else if (distanceInKm >= 100) {
            return new TruckTransport();
        } else {
            return new MiniVanTransport();
        }
    }

    public calculateShippingCharge(distanceInKm: number, weightInKg: number): number {
        return this.strategy.calculateCost(distanceInKm, weightInKg);
    }

    public getTransportMode(): string {
        return this.strategy.getModeName();
    }
}
