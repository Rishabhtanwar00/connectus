import React, { Fragment } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Outlet,
} from 'react-router-dom';
import Navbar from '../src/components/layout/Navbar.js';
import Landing from '../src/components/layout/Landing.js';
import Register from '../src/components/auth/Register.js';
import Login from '../src/components/auth/Login.js';
import Alert from './components/layout/Alert.js';
import './App.css';

//redux
import { Provider } from 'react-redux';
import Store from './store.js';

const nestedRoute = () => (
	<>
		<div className='container'>
			<Alert />
			<Outlet />
		</div>
	</>
);

const App = () => {
	return (
		<Provider store={Store}>
			<Router>
				<Navbar />
				<div className='container'>
					<Alert />
				</div>

				<Routes>
					<Route exact path='/' element={<Landing />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/login' element={<Login />} />
				</Routes>
			</Router>
		</Provider>
	);
};

export default App;
