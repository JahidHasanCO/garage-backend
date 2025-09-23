import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    address: {type: String},
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, { timestamps: true }); 

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
