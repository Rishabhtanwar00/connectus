import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
	const token = req.header('x-auth-token');

	if (!token) {
		return res
			.status(401)
			.json({ msg: 'Invalid token, authorization denied.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWTTOKEN);
		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'token is invalid' });
	}
}
