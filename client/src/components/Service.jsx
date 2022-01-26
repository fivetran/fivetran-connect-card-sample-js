import React, { useState, useEffect } from "react";
import {
  Link,
  Redirect,
  useParams,
} from "react-router-dom";

import { handleError, post } from '../request';
import { LoadingIndicator } from "./LoadingIndicator";

export function Service(props) {
  let { id } = useParams();
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const submit = async () => {
      try {
        const connector = await post('/_/connectors', { service: id, name: name });
        setRedirect(`/connectors/${connector.id}`);
      } catch(e) {
        setError(handleError(e));
      }
    }
    if (submitted) {
      submit();
    }
  }, [submitted, id, name]);
  
  if (redirect)
    return <Redirect to={redirect}/>;

  if (error)
    return <h2>An error occured: {error}</h2>

  if (!props.services || submitted)
    return <LoadingIndicator />;

  const service = props.services.filter(s => s.id === id)[0];

  const onSubmit = (event) => {
    setSubmitted(true);
    event.preventDefault();
  }

  if (service) {
    return (
      <div className="center service-form">
        <Link to="/services"><h4>Back</h4></Link>
        <img className="service-icon-big" src={service.icon_url} alt={service.name} />
        <h1 className="service-description">{service.name}</h1>
        <p>{service.description}</p>
        <a href={service.link_to_docs}>Learn more about {service.name}</a>
        <br />
        <div className="name-form">
          <label>Connector Name: </label>
          <br />
          <input type="text" className="name-input" value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <div className="button" onClick={onSubmit}>
            <h2>Create connector</h2>
          </div>
        </div>
      </div>
    );
  }
  return <LoadingIndicator />;
}

