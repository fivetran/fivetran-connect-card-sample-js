import React, { useState, useEffect } from "react";
import {
  Link,
} from "react-router-dom";

import { get, handleError } from '../request';
import { LoadingIndicator } from "./LoadingIndicator";

export function Connectors(props) {

  const [submitted, setSubmitted] = useState(false);
  const [connectorId, setConnectorId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const submit = async () => {
      try {
        const link = await get(`/_/connectors/${connectorId}/form`);
        window.location.href = `${link.url}&redirect_uri=http://localhost:3000/connectors/`;
      } catch(e) {
        setError(handleError(e));
      }
    }
    if (submitted) {
      submit();
    }
  }, [submitted,  connectorId]);

  const onSubmit = (event, id) => {
    setSubmitted(true);
    setConnectorId(id)
    event.preventDefault();
  }

  if (error)
    return <h2>An error occured: {error}</h2>

  if (submitted)
    return <LoadingIndicator />;

  if (props.connectors && props.services) {
    const connectors = props.connectors
      .filter(c => {
        // We need to filter connectors in group that could be unavailable via API (no service metadata provided)
        const service = props.services.filter(s => s.id === c.service)[0];
        return (typeof service !== "undefined");
      })
      .map((item) => {
        const service = props.services.filter(s => s.id === item.service)[0];
        if (service) {
          return (
              <div className="service-item" onClick={e => onSubmit(e, item.id)}>
                <img className="service-icon" src={service.icon_url} alt={service.name} />
                <h3 className="service-description">
                  {item.display_name}
                </h3>
              </div>
          );
        } else {
          return (
            <div className="service-item" onClick={e => onSubmit(e, item.id)}>
                <h3 className="service-description">
                  {item.display_name}
                </h3>
              </div>);
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
  return <LoadingIndicator />;
}
