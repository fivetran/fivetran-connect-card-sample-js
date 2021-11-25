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

import { get, handleError  } from './request';


import './PBF-App.css'

export default function App () {
  const[services, setServices] = useState(null);
  const[connectors, setConnectors] = useState(null);
  const[error, setError] = useState(null);
  
  useEffect(() => {
    const load = async () => {
      try {
        const services = await get('/_/services');
        const connectors = await get('/_/connectors');
        setServices(services);
        setConnectors(connectors);
        setError(null);
      } catch (e) {
        setError(handleError(e));
      }
    }
    load();
  }, []);

  if (!error){
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
  } else {
    return (<h2>An error occured: {error}</h2>);
  }
}
