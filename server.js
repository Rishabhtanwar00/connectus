import express from 'express';
import connectDB from './config/db.js';
import profileRoute from './routes/api/profile.js';
import userRoute from './routes/api/users.js';
import authRoute from './routes/api/auth.js';
import postsRoute from './routes/api/posts.js';

const app = express();

//connect Database
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
	res.send('server running');
});

//Define Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
