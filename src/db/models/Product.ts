import mongoose, { Schema, Document } from 'mongoose';

export interface IDimension {
    length: number;
    width: number;
    height: number;
    unit: string;
}

export interface IProduct extends Document {
    productId: string;
    sellerId: string;
    name: string;
    price: number;
    weightInKg: number;
    dimension: IDimension;
}

const DimensionSchema = new Schema<IDimension>({
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, required: true }
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
    productId: { type: String, required: true, unique: true },
    sellerId: { type: String, required: true }, // References Seller.sellerId
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weightInKg: { type: Number, required: true },
    dimension: { type: DimensionSchema, required: true }
}, { timestamps: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
