import React from 'react';
import { render  as ReactDOM} from 'react-dom';
import { App } from './containers/App';
import { Home, SinglePost, Login, NotFound, Profile } from './containers';
import { Router, Route } from './components/router';
import { history } from './history';
import { firebase } from './backend';

import './styles/styles.scss';

// Function that wraps ReactDOM.render and renders the app w/ current location
export const renderApp = (state) => {
	ReactDOM(
    <Router {...state}>
        <Route  path="/" index={Home}       component={App}>
	        <Route  path="posts/:post"      component={SinglePost} />
	        <Route  path="login"            component={Login}  />
	        <Route  path="profile"          component={Profile}  />
	        <Route path="*"                 component={NotFound} />
        </Route>
    </Router>,
    document.getElementById('app'),
  );
};

// Create an intial state object to use
console.log(`src/index.js location = ${window.location.pathname}`);
const initialState = {
  location: window.location.pathname,
};

// When there's a history change, re-render the app
export function activateHistoryListener() {
  history.listen((location) => {
    const user = firebase.auth().currentUser;
    const newState = Object.assign(initialState, {
      location: user
                ? location.pathname
                : '/login',
    });

    renderApp(newState);
  });
}

// Set up the auth listener
export function activateAuthListener() {
  firebase.auth().onAuthStateChanged(((user) => {
    if (user && window.location.pathname === '/login') {
      return history.push('/');
    }
    return history.push(user ? window.location.pathname : '/login');
  }));
}


// Render the app initially
renderApp(initialState);
//activateHistoryListener();
//activateAuthListener();
