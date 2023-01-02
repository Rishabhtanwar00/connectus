import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { removeComment } from '../../actions/post.js';

const CommentItem = ({
	postId,
	comment: { _id, text, name, avatar, user, date },
	auth,
	removeComment,
}) => {
	return (
		<div class='post bg-white p-1 my-1'>
			<div>
				<Link to={`/profile/${user}`}>
					<img class='round-img' src={avatar} alt='' />
					<h4>{name}</h4>
				</Link>
			</div>
			<div>
				<p class='my-1'>{text}</p>
				<p class='post-date'>
					Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
				</p>
				{!auth.loading && user === auth.user._id && (
					<button
						className='btn btn-danger'
						type='button'
						onClick={(e) => removeComment(postId, _id)}
					>
						<i className='fas fa-times'></i>
					</button>
				)}
			</div>
		</div>
	);
};

CommentItem.propTypes = {
	postId: PropTypes.string.isRequired,
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	removeComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});
export default connect(mapStateToProps, { removeComment })(CommentItem);
