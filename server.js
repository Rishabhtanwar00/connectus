import express from 'express';
import connectDB from './config/db.js';
import profileRoute from './routes/api/profile.js';
import userRoute from './routes/api/users.js';
import authRoute from './routes/api/auth.js';
import postsRoute from './routes/api/posts.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

//connect Database
connectDB();

//Init middleware
app.use(express.json({ extended: false }));
app.use(cors());

//Define Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
