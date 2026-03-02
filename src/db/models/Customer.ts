import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation {
    lat: number;
    lng: number;
}

export interface ICustomer extends Document {
    customerId: string;
    name: string;
    phoneNumber: string;
    location: ILocation;
}

const LocationSchema = new Schema<ILocation>({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
}, { _id: false });

const CustomerSchema = new Schema<ICustomer>({
    customerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: { type: LocationSchema, required: true }
}, { timestamps: true });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
