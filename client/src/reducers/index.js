import { combineReducers } from 'redux';
import alert from './alert.js';
import auth from './auth.js';
import profile from './profile.js';
import post from './post.js';

export default combineReducers({ alert, auth, profile, post });
