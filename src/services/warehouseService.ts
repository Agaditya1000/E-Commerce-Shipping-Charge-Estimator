import { Warehouse, IWarehouse } from '../db/models/Warehouse';
import { ILocation } from '../db/models/Customer';
import { DistanceService } from './distanceService';

export class WarehouseService {
    /**
     * Finds the nearest warehouse to a given location.
     */
    static async findNearestWarehouse(location: ILocation): Promise<{ warehouse: IWarehouse, distanceInKm: number } | null> {
        const warehouses = await Warehouse.find({});

        if (!warehouses || warehouses.length === 0) {
            return null;
        }

        let nearestWarehouse: IWarehouse | null = null;
        let minDistance = Infinity;

        for (const warehouse of warehouses) {
            const distance = DistanceService.calculateDistance(location, warehouse.location);
            if (distance < minDistance) {
                minDistance = distance;
                nearestWarehouse = warehouse;
            }
        }

        if (!nearestWarehouse) {
            return null; // Should ideally never reach here if warehouses.length > 0
        }

        return {
            warehouse: nearestWarehouse,
            distanceInKm: minDistance
        };
    }
}
