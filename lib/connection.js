const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('process.env.MONGO_URI', process.env.MONGO_URI)
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'wallet_db',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connection Success.');
        return connection;
    } catch (error) {
        console.error('Mongo Connection Error', error);
    }
};

module.exports = {
    connectDB
};
