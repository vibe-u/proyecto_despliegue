import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

const connection = async () => {
    
    try {
        const { connection: dbConnection } = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`✅ Database connected on ${dbConnection.host}:${dbConnection.port}`);
        console.log("✅ MongoDB conectado correctamente");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
    }
};
export default connection;
