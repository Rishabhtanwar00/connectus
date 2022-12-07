import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const InitialState = {};

const middleware = [thunk];

// const Store = createStore(
// 	rootReducer,
// 	InitialState,
// 	applyMiddleware(composeWithDevTools(...middleware))
// );

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const Store = createStore(
	rootReducer,
	InitialState,
	composeEnhancers(applyMiddleware(...middleware))
);

export default Store;
