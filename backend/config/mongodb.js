import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model("User", userSchema);

const connectDB = async () => {
    mongoose.connection.on("connected", () => console.log("MongoDB connection successful"));
    mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/dr_homie`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Write test data
        

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

export default connectDB;
