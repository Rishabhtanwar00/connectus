import express from 'express';
import connectDB from './config/db.js';

const app = express();
//connect Database
connectDB();

app.get('/', (req, res) => {
	res.send('server running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
