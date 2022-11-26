import mongoose from 'mongoose';
const postRoute = mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'users',
	},
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	avatar: {
		type: String,
	},
	likes: [
		{
			user: {
				type: mongoose.Types.ObjectId,
				ref: 'users',
			},
		},
	],
	comments: [
		{
			user: {
				type: mongoose.Types.ObjectId,
				ref: 'users',
			},
			text: {
				type: String,
				required: true,
			},
			name: {
				type: String,
			},
			avatar: {
				type: String,
			},
			date: {
				type: Date,
				default: Date.now(),
			},
		},
	],
	date: {
		type: Date,
		default: Date.now(),
	},
});

const post = mongoose.model('post', postRoute);
export default post;
