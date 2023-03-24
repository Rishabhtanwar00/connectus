import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner.js';
import DashboardActions from './DashboardActions.js';
import Experience from './Experience.js';
import Education from './Education.js';
import { getCurrentProfile, deleteAccount } from '../../actions/profile.js';

const Dashboard = ({
	getCurrentProfile,
	deleteAccount,
	auth: { user },
	profile: { profile, loading },
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, []);

	return (
		<div className='container'>
			{loading && profile === null ? (
				<Spinner />
			) : (
				<Fragment>
					<h1 className='large text-primary'>Dashboard</h1>
					<p className='lead'>
						<i className='fas fa-user' /> Welcome {user && user.name}
					</p>
					{profile !== null ? (
						<Fragment>
							<DashboardActions />
							<Experience experience={profile.experience} />
							<Education education={profile.education} />

							<div className='my-2'>
								<button
									className='btn btn-danger'
									onClick={() => deleteAccount()}
								>
									<i className='fas fa-user-minus'></i> Delete My Account
								</button>
							</div>
						</Fragment>
					) : (
						<Fragment>
							<p>You have not set up a profile, Please enter some info</p>
							<Link to='/create-profile' className='btn btn-primary my-1'>
								Create Profile
							</Link>
						</Fragment>
					)}
				</Fragment>
			)}
		</div>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
	Dashboard
);
