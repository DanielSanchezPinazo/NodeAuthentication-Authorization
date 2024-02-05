
import mongoose, { Schema } from "mongoose";


const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [ true, "Name is required."],// es requerido y añadimos un mensaje de error
    },
    available: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
});

export const CategoryModel = mongoose.model( "Category", categorySchema );




