import mongoose, { Document, Schema, Model, model } from 'mongoose';

interface IUser extends Document {
    name: string;
    age: number;
    email: string;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;