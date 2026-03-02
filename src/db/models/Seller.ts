import mongoose, { Schema, Document } from 'mongoose';
import { ILocation } from './Customer';

export interface ISeller extends Document {
    sellerId: string;
    name: string;
    location: ILocation;
}

const LocationSchema = new Schema<ILocation>({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const SellerSchema = new Schema<ISeller>({
    sellerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: LocationSchema, required: true }
}, { timestamps: true });

export const Seller = mongoose.model<ISeller>('Seller', SellerSchema);
