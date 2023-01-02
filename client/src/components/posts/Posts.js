import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner.js';
import { connect } from 'react-redux';
import PostItem from './PostItem.js';
import PostForm from './PostForm.js';
import { getPosts } from '../../actions/post.js';

const Posts = ({ getPosts, post: { posts, loading } }) => {
	useEffect(() => {
		getPosts();
	}, []);
	return (
		<div className='container'>
			{loading ? (
				<Spinner />
			) : (
				<Fragment>
					<h1 className='large text-primary'>Posts</h1>
					<p className='lead'>
						<i className='fas fa-user'></i> Welcome to the Community
					</p>
					<PostForm />
					<div className='posts'>
						{posts.map((post) => (
							<PostItem key={post._id} post={post} />
						))}
					</div>
				</Fragment>
			)}
		</div>
	);
};

Posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
