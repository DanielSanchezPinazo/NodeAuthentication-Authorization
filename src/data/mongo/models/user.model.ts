
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [ true, "Name is required."],// es requerido y añadimos un mensaje de error
    },
    email: {
        type: String,
        required: [ true, "Email is required."],
        unique: true, // esto es para indicar que no se puede repetir
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [ true, "Password is required."],// es requerido y añadimos un mensaje de error
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: [ "ADMIN_ROLE", "USER_ROLE" ],
    }
});

userSchema.set( "toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.password;
    },
});


export const UserModel = mongoose.model( "User", userSchema );




