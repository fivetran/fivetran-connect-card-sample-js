import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Connector } from './components/Connector';
import { Connectors } from './components/Connectors';
import { Service } from "./components/Service";
import { Services } from "./components/Services"

import { get  } from './request';

import './PBF-App.css'

export default function App () {
  const[services, setServices] = useState(null);
  const[connectors, setConnectors] = useState(null);

  useEffect(() => {
    get('/_/services')
      .then(res => setServices(res)) //TODO use async/await & try catch for calling async functions and error handling
      .catch(err => console.log(err));//TODO: it is unclear that something went from when it shown in console, i think we should render some error message with troubleshooting info, at least for the case when no api secret&key set

    get('/_/connectors')
      .then(res => setConnectors(res))
      .catch(err => console.log(err)); //same here
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/connectors/:id">
          <Connector services={services} connectors={connectors}/>
        </Route>
        <Route path="/connectors">
          <Connectors services={services} connectors={connectors}/>
        </Route>
        <Route path="/services/:id">
          <Service services={services}/>
        </Route>
        <Route path="/services">
          <Services services={services}/>
        </Route>
        <Route path="/">
          <div className="center">
            <Link to="/services">
              <div className="button">
                <h2>Create a connector</h2>
              </div>
            </Link>
            <Link to="/connectors">
              <div className="button">
                <h2>Browse connectors</h2>
              </div>
            </Link>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}
