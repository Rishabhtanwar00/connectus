import React, { Fragment } from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileEducation = ({
	education: { school, degree, fieldofstudy, from, to, description },
}) => {
	return (
		<div>
			<h3 className='text-dark'>{school}</h3>
			<p>
				<Moment format='YYYY/MM/DD'>{from}</Moment> -
				{!to ? ' now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
			</p>
			<p>
				<strong>Degree: </strong>
				{degree}
			</p>
			<p>
				<strong>Field Of Study: </strong>
				{fieldofstudy}
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

ProfileEducation.propTypes = {
	education: PropTypes.object.isRequired,
};

export default ProfileEducation;
