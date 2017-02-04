// Major thanks to TJ Holowaychuk's work on https://github.com/tj/react-enroute
// This code draws on the simple router created there; thanks (again) TJ!

import React, { Component, PropTypes } from 'react';
import enroute from 'enroute';
import invariant from 'invariant';

export class Router extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element),
    location: PropTypes.string.isRequired,
  }

  // You could also take advantage of class properties and store routes there
  // routes = {};

  constructor(props) {
    super(props);

    // We'll store the routes on the Router component
    this.routes = {};

    // Add all the children components to the routes
    this.addRoutes(props.children);

    console.info('Router constructor(): Routes are:', this.routes);

    // Set up the router for matching & routing
    //https://github.com/lapwinglabs/enroute
    //Viene usato in render()
    this.router = enroute(this.routes);
  }

  addRoute(element, parent) {
  // Get the component, path, index, and children props from a given child
    const { component, path, children, index } = element.props;

    console.info(`Adding path: ${path}`);
    console.info({ path, component: component.name });

    // Ensure that it has the right input, since PropTypes can't really help here
    invariant(component, `Route ${path} is missing the "path" property`);
    invariant(typeof path === 'string', `Route ${path} is not a string`);

    // Set up Ccmponent to be rendered
    const render = (params, renderProps) => {
      console.info('Current route params are: ');
      console.info(params);
      const finalProps = Object.assign({ params }, this.props, renderProps);

      // Or, using the object spread operator (currently a candidate proposal for future versions of JavaScript)
      // const finalProps = {
      //   ...this.props,
      //   ...renderProps,
      //   params,
      // };

      
     
      const hasIndexRoute = index && path === finalProps.location;

      //Se la route in esame ha una props.index, allora tale component viene nestato in esso!
      const children = hasIndexRoute
                ? React.createElement(component, finalProps, React.createElement(index, finalProps))
                : React.createElement(component, finalProps);

      return parent
                ? parent.render(params, { children })
                : children;
    };

    // Set up the route itself (/a/b/c)
    const route = this.normalizeRoute(path, parent);

    // If there are children, add those routes, too
    if (children) {
      this.addRoutes(children, { route, render });
    }

    // Set up the route on the routes property
    this.routes[this.cleanPath(route)] = render;
  }

  addRoutes(routes, parent) {
   //routes e' parent.props.children e non e' un array di plain object.
   //Occorre usare React.Children.map(),React.Children.forEach() per iterarli...
    React.Children.forEach(routes, route => this.addRoute(route, parent));
  }

  normalizeRoute(path, parent) {
   // If there's just a /, it's an absolute route
    if (path[0] === '/') {
      return path;
    }
   // No parent, no need to join stuff together
    if (!parent) {
      return path;
    }
    // Join the child to the parent route
    return `${parent.route}/${path}`;
  }

  cleanPath(path) {
    return path.replace(/\/\//g, '/');
  }

  render() {
    const { location } = this.props;  //viene settata in src/index.js  location: window.location.pathname
    console.log(`Router.render(${location})`);
    invariant(location, '<Router/> needs a location to work');//se location e' falsy e process.env.NODE_ENV=='production' lancia errore
    let matching_route = this.router(location);  //router = enroute(this.routes)  
    return matching_route;
  }
}
