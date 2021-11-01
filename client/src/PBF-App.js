import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import './PBF-App.css'

export default function App () {
  const[services, setServices] = useState(null);
  const[connectors, setConnectors] = useState(null);

  useEffect(() => {
    get('/_/services')
      .then(res => setServices(res))
      .catch(err => console.log(err));

    get('/_/connectors')
      .then(res => setConnectors(res))
      .catch(err => console.log(err));
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

function Connectors(props) {
  if (props.connectors && props.services){
    const connectors = props.connectors
      .filter(c => {
        // We need to filter connectors in group that could be unavailable via API (no service metadata provided)
        const service = props.services.filter(s => s.id === c.service)[0];
        return (typeof service !== "undefined");
      })
      .map((item) => { 
        const service = props.services.filter(s => s.id === item.service)[0];
        if (service){
          return (
            <Link to={`/connectors/${item.id}`}>
              <div className="service-item">
                <img className="service-icon" src={service.icon_url} alt={service.name}/>
                <h3 className="service-description">
                    {item.schema}
                </h3>
              </div>
            </Link>);
        } else {
          return (
            <Link to={`/connectors/${item.id}`}>
              <div className="service-item">
                <h3 className="service-description-no-icon">
                    {item.schema}
                </h3>
              </div>
            </Link>);
        }
      });
    return (
      <div className="center-horizontal list-container ">
        <Link to="/services">
          <div className="button">
            <h2>Create a connector</h2>
          </div>
        </Link>
        <h2>Your connectors:</h2>
        {connectors}
      </div>
    );
  }
  return <LoadingIndicator/>;
}

function  Services (props) {
  if (props.services){
    const services = props.services.map((item) => (
      <Link to={`services/${item.id}`}>
        <div className="service-item">
          <img className="service-icon" src={item.icon_url} alt={item.name}/>
          <h3 className="service-description">
            {item.name}
          </h3>
        </div>
      </Link>
    ));

    return (
      <div className="center-horizontal list-container">
        <Link to="/connectors">
          <div className="button">
            <h2>Browse connectors</h2>
          </div>
        </Link>
        <h2>Choose source:</h2>
        {services}
      </div>
    );
  } 
  return <LoadingIndicator/>
}

function Connector(props) {
  let { id } = useParams();
  const [editLink, setEditLink] = useState(null);
  useEffect(() => {
    get('/_/connectors/' + id + '/form')
      .then(res =>  setEditLink(res.url + '&redirect_uri=http://localhost:3000/connectors/' + res.connectorId))
      .catch(err => console.log(err));
  }, [id]);
  if (!props.connectors || !props.services || !editLink)
    return (<LoadingIndicator/>);

  const connector = props.connectors.filter(c => c.id === id)[0];
  if (connector){
    const service = props.services.filter(s => s.id === connector.service)[0];
    if (service){
      return (
        <div className="center service-form">
          <Link to="/connectors"><h4>Back</h4></Link>
          <br/>
          <img className="service-icon-big" src={service.icon_url} alt={service.name}/>
          <h2 className="service-description">Connector : {connector.schema}</h2>
          <p>Id : {connector.id}</p>
          <p>Status : {connector.status.setup_state}</p>
          <a href={editLink}>
            <div className="button">
              <h2>Edit connector</h2>
            </div>
          </a>
        </div>
      );
    } else {
      return (
        <div className="center service-form">
          <Link to="/connectors">Back to connectors</Link><br/>
          <h2 className="service-description">Connector : {connector.schema}</h2>
          <p>Id : {connector.id}</p>
          <p>Status : {connector.status.setup_state}</p>
        </div>
      );
    }
  }
  return (<h2>Oops! Connector with id {id} not found :(</h2>)
}

function Service(props) {
  let {id} = useParams();
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log('Creating a connector');
    post('/_/connectors', {service: id, name: name })
      .then(res => {
        window.location.href = res.url + '&redirect_uri=http://localhost:3000/connectors/' + res.connectorId;
      })
      .catch(err => console.log(err));
  }, [submitted]);
  
  if (!props.services || submitted)
    return <LoadingIndicator/>;

  const service = props.services.filter(s => s.id === id)[0];

  const onSubmit = (event) => {
    setSubmitted(true);
    event.preventDefault();
  }

  if (service){
    return (
      <div className="center service-form">
        <Link to="/services"><h4>Back</h4></Link>
        <img className="service-icon-big" src={service.icon_url} alt={service.name}/>
        <h1 className="service-description">{service.name}</h1>
        <p>{service.description}</p>
        <a href={service.link_to_docs}>Learn more about {service.name}</a>
        <br/>
        <div className="name-form">
          <label>Connector Name: </label>
          <br/>
          <input type="text" className="name-input" value={name} onChange={(e) => setName(e.target.value)} />
          <br/>
          <div className="button" onClick={onSubmit}>
            <h2>Create connector</h2>
          </div>
        </div>
      </div>
    );
  } 
  return <LoadingIndicator/>;
}

function LoadingIndicator() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setInterval(function(){ setCount(prevCount => prevCount + 1) }, 700);
  }, []);

  switch(count % 4){
    case 0:
      return (<h2 className="center">Loading.</h2>);
    case 1:
      return (<h2 className="center">Loading..</h2>);
    case 2:
      return (<h2 className="center">Loading...</h2>);
    default:
      return (<h2 className="center">Loading</h2>);
  }
}

const get = async (path) => {
  const response = await fetch(path);
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message) 
  }
  return body;
}

const post = async (path, data) => {
  const response = await fetch(path, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}