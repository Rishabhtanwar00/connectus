import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.MONGOURI);
		console.log('mongodb connected');
	} catch (err) {
		console.error(err.message);
		console.log('mongodb not connected');
		// exit process with failure
		process.exit(1);
	}
};

export default connectDB;
