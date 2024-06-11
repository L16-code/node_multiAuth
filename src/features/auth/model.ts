import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        required:true,
        default:'user',
        enum:['user','admin']
    }
});

export const UserModel = mongoose.model('User', userSchema);
