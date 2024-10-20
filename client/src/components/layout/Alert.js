import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
	return (
		alerts != null &&
		alerts.length > 0 && (
			<div className='altContainer'>
				
				<div
					key={alerts[0].id}
					className={`alert alert-${alerts[0].alertType}`}
				>
					{alerts[0].msg}
				</div>
			</div>
		)
	);
};

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
	alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
