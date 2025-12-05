import mongoose  from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }, // jo subsribe kr rha hai

        channel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }, //jisko subscribe kr rha hai
    }, 
    {timestamps:true}
);

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;