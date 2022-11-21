import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../../models/User.js';

// @route   POST api/users
// @desc    Post data
// @access  public
router.post(
	'/',
	[
		body('name', 'Name is required').not().isEmpty(),
		body('email', 'Please include a valid email address').isEmail(),
		body('password', 'Password should be 6 or more characters long.').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, password } = req.body;
		try {
			//see if user exists
			let user = await User.findOne({ email: email });
			if (user) {
				console.log('user already exists');
				return res
					.status(400)
					.json({ errors: [{ msg: 'user already exists' }] });
			}

			//get gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			user = new User({ name, email, avatar, password });

			//encrypting password
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			//return jsonwebtokem

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtToken'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(500).send('server error');
		}
	}
);

export default router;
