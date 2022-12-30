import React, { Fragment } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileExperience = ({
	experience: { company, from, to, title, description },
}) => {
	return (
		<div>
			<h3 className='text-dark'>{company}</h3>
			<p>
				<Moment format='YYYY/MM/DD'>{from}</Moment> -
				{!to ? ' now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
			</p>
			<p>
				<strong>Position: </strong>
				{title}
			</p>
			<p>
				{description && (
					<Fragment>
						<strong>Description: </strong>
						{description}
					</Fragment>
				)}
			</p>
		</div>
	);
};

ProfileExperience.propTypes = {
	experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
