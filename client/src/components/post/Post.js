import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../layout/Spinner.js';
import PostItem from '../posts/PostItem.js';
import PropTypes from 'prop-types';
import CommentForm from './CommentForm.js';
import CommentItem from './CommentItem.js';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post.js';

const Post = ({ getPost, post: { post, loading } }) => {
	const { id } = useParams();
	useEffect(() => {
		getPost(id);
	}, []);
	return (
		<div className='container'>
			{loading || post === null ? (
				<Spinner />
			) : (
				<Fragment>
					<PostItem post={post} showActions={false} />
					<CommentForm postId={post._id} />
					<div className='comments'>
						{post.comments.map((comment) => (
							<CommentItem
								key={comment._id}
								comment={comment}
								postId={post._id}
							/>
						))}
					</div>
				</Fragment>
			)}
		</div>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
