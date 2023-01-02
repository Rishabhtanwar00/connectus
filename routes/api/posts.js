import express from 'express';
import auth from '../../middleware/auth.js';
import { check, validationResult } from 'express-validator';
import Post from '../../models/Post.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';
const router = express.Router();

// @route   POST api/posts
// @desc    create a new post
// @access  private
router.post(
	'/',
	[auth, [check('text', 'Empty post can not be added.').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req, res);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});

			const post = await newPost.save();

			res.json(post);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('server error');
		}
	}
);

// @route   GET api/posts
// @desc    Get all posts
// @access  private

router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  private

router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ msg: 'post not found' });
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(404).json({ msg: 'post not found' });
		}
		res.status(500).send('server error');
	}
});

// @route   DELETE api/posts/:id
// @desc    delete post
// @access  private

router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'post not found' });
		}

		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'user not authorised' });
		}

		await post.remove();
		res.json({ msg: 'post removed successfully' });
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(404).json({ msg: 'post not found' });
		}
		res.status(500).send('server error');
	}
});

// @route   PUT api/posts/like/:id
// @desc    like post
// @access  private

router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//check if post is already liked
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id).length >
			0
		) {
			return res.status(400).json({ msg: 'post is already liked' });
		}

		await post.likes.unshift({ user: req.user.id });

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   PUT api/posts/unlike/:id
// @desc    unlike post
// @access  private

router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//check if post is liked or not
		if (
			post.likes.filter((like) => like.user.toString() === req.user.id)
				.length === 0
		) {
			return res.status(400).json({ msg: 'post is not liked yet' });
		}

		//get remove index
		const removeIndex = post.likes
			.map((like) => like.user.toString())
			.indexOf(req.user.id);

		await post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   POSt api/posts/comment/:id
// @desc    comment post
// @access  private

router.post(
	'/comment/:id',
	[auth, [check('text', 'Empty comment can not be added').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id);

			const newComment = {
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			};

			post.comments.unshift(newComment);

			await post.save();

			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('server error');
		}
	}
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment
// @access  private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//check if comment exits
		const comment = post.comments.find(
			(comment) => comment.id === req.params.comment_id
		);

		if (!comment) {
			return res.status(404).json({ msg: 'Comment does not exists' });
		}

		//check user
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorised' });
		}

		//find remove index
		const removeIndex = post.comments
			.map((comment) => comment.user.toString())
			.indexOf(req.user.id);

		post.comments.splice(removeIndex, 1);

		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

export default router;
