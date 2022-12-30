import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../src/components/layout/Navbar.js';
import Landing from '../src/components/layout/Landing.js';
import Register from '../src/components/auth/Register.js';
import Login from '../src/components/auth/Login.js';
import Alert from './components/layout/Alert.js';
import Dashboard from './components/dashboard/Dashboard.js';
import PrivateRoute from './components/routing/PrivateRoute.js';
import setAuthToken from './utils/setAuthToken.js';
import CreateProfile from './components/profile-forms/CreateProfile.js';
import EditProfile from './components/profile-forms/EditProfile.js';
import AddExperience from './components/profile-forms/AddExperience.js';
import AddEducation from './components/profile-forms/AddEducation.js';
import Profiles from './components/profiles/Profiles.js';
import { loadUser } from './actions/auth.js';
import './App.css';

//redux
import { Provider } from 'react-redux';
import Store from './store.js';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}
const App = () => {
	useEffect(() => {
		Store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={Store}>
			<Router>
				<Alert />
				<Navbar />
				<Routes>
					<Route exact path='/' element={<Landing />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/login' element={<Login />} />
					<Route exact path='/profiles' element={<Profiles />} />
					<Route
						exact
						path='/dashboard'
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/create-profile'
						element={
							<PrivateRoute>
								<CreateProfile />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/edit-profile'
						element={
							<PrivateRoute>
								<EditProfile />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/add-experience'
						element={
							<PrivateRoute>
								<AddExperience />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/add-education'
						element={
							<PrivateRoute>
								<AddEducation />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</Provider>
	);
};

export default App;
