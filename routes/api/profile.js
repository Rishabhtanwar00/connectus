import express from 'express';
import auth from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import { check, validationResult } from 'express-validator';
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

// @route   POST api/profile/
// @desc    create or update user profile
// @access  private

router.post(
	'/',
	[
		auth,
		check('status', 'status is required').not().isEmpty(),
		check('skills', 'skills is required').not().isEmpty(),
	],
	async (req, res) => {
		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			status,
			bio,
			githubusername,
			skills,
			youtube,
			twitter,
			facebook,
			linkedin,
			instagram,
		} = req.body;

		// build profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (status) profileFields.status = status;
		if (bio) profileFields.bio = bio;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map((skill) => skill.trim());
		}

		//build social object
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (twitter) profileFields.social.twitter = twitter;
		if (facebook) profileFields.social.facebook = facebook;
		if (linkedin) profileFields.social.linkedin = linkedin;
		if (instagram) profileFields.social.instagram = instagram;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				//update profile
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res.json(profile);
			}

			//create profile
			profile = new Profile(profileFields);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('server error');
		}
	}
);

// @route   get api/profile/
// @desc    get all profiles
// @access  public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   get api/profile/user/:user_id
// @desc    get user_id profiles
// @access  public

router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);
		if (!profile) {
			return res.status(400).json({ msg: 'No profile found' });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'No profile found' });
		}
		res.status(500).send('server error');
	}
});

// @route   delete api/profile/
// @desc    delete profile,user and posts
// @access  private

router.delete('/', auth, async (req, res) => {
	try {
		//@todo remove user posts fro

		//remove profile
		await Profile.findOneAndRemove({ user: req.user.id });

		//remove user
		await User.findByIdAndRemove({ _id: req.user.id });
		res.json({ msg: 'profile deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

export default router;
