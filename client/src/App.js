import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../src/components/layout/Navbar.js';
import Landing from '../src/components/layout/Landing.js';
import Register from '../src/components/auth/Register.js';
import Login from '../src/components/auth/Login.js';
import './App.css';

const App = () => {
	return (
		<Router>
			<Fragment>
				<Navbar />
				<Routes>
					<Route exact path='/' element={<Landing />} />
					<Route exact path='/register' element={<Register />} />
					<Route exact path='/login' element={<Login />} />
				</Routes>
			</Fragment>
		</Router>
	);
};

export default App;
