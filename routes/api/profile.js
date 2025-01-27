import express from 'express';
import auth from '../../middleware/auth.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';
import request from 'request';
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

// @route   GET api/profile/user/:user_id
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
		//remove Posts
		await Post.deleteMany({ user: req.user.id });

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

// @route   PUT api/profile/experience
// @desc    adding experience
// @access  private

router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is Required').not().isEmpty(),
			check('company', 'Company is Required').not().isEmpty(),
			check('from', 'From Date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;
		const NewExp = { title, company, location, from, to, current, description };

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(NewExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('server error');
		}
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    deleting experience
// @access  private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// get remove experience index

		const removeIndex = profile.experience
			.map((item) => {
				item.id;
			})
			.indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.send(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   PUT api/profile/education
// @desc    adding education
// @access  private

router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is Required').not().isEmpty(),
			check('degree', 'Degree is Required').not().isEmpty(),
			check('fieldofstudy', 'Fieldofstudy is Required').not().isEmpty(),
			check('from', 'From Date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body;
		const NewEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(NewEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('server error');
		}
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    deleting education
// @access  private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// get remove education index

		const removeIndex = profile.education
			.map((item) => {
				item.id;
			})
			.indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);

		await profile.save();

		res.send(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   GET api/profile/github/:username
// @desc    get git repos from github for user
// @access  public

router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUBCLIENTID}&client_secret=${process.env.GITHUBSECRET}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) {
				console.error(error);
			}

			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'not github profile found.' });
			}

			res.send(JSON.parse(body));
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

export default router;
