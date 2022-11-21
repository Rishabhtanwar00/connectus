import express from 'express';
import auth from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
const router = express.Router();

// @route   GET api/profile/me
// @desc    get current users profile
// @access  private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);

		if (!profile) {
			return res.status(400).json({ msg: 'No profile found for this user' });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('server error');
	}
});

export default router;
