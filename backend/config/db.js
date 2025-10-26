import mongoose from "mongoose";
const connectDb = async () => {
    try {

        if(!mongoose.connection?.host)
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")
    } catch (error) {
        console.log(error);
        
        console.log("DB error")
    }
    
}
export default connectDb