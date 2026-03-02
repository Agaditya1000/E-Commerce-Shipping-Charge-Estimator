import mongoose, { Schema, Document } from 'mongoose';
import { ILocation } from './Customer';

export interface IWarehouse extends Document {
    warehouseId: string;
    name: string;
    location: ILocation;
}

const LocationSchema = new Schema<ILocation>({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const WarehouseSchema = new Schema<IWarehouse>({
    warehouseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: LocationSchema, required: true }
}, { timestamps: true });

export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
