import express from 'express';
import connectDB from './config/db.js';
import profileRoute from './routes/api/profile.js';
import userRoute from './routes/api/users.js';
import authRoute from './routes/api/auth.js';
import postsRoute from './routes/api/posts.js';
import path from 'path';

const app = express();

//connect Database
connectDB();

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

//Init middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postsRoute);

//serve static asset in production
// if (process.env.NODE_ENV === 'production') {
// 	//set static folder
// 	app.use(express.static('client/build'));

// 	app.get('*', (req, res) => {
// 		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// 	});
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
