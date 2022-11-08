import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.send('server running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
