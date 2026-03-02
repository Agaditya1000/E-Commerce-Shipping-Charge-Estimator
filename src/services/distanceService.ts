import { ILocation } from '../db/models/Customer';

export class DistanceService {
    /**
     * Calculates the distance between two geo-coordinates in kilometers using the Haversine formula.
     */
    static calculateDistance(loc1: ILocation, loc2: ILocation): number {
        const R = 6371; // Radius of the Earth in km
        const dLat = this.deg2rad(loc2.lat - loc1.lat);
        const dLng = this.deg2rad(loc2.lng - loc1.lng);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(loc1.lat)) *
            Math.cos(this.deg2rad(loc2.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    private static deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}
