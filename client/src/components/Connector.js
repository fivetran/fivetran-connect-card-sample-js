import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { get } from '../request';
import { LoadingIndicator } from "./LoadingIndicator";

export function Connector(props) {
  let { id } = useParams();
  const [editLink, setEditLink] = useState(null);
  useEffect(() => {
    get(`/_/connectors/${id}/form`) //TODO: use string interpolation everywhere instead of concatenation
      .then(res => setEditLink(res.url + '&redirect_uri=http://localhost:3000/connectors/' + res.connectorId))
      .catch(err => console.log(err));
  }, [id]);
  if (!props.connectors || !props.services || !editLink)
    return (<LoadingIndicator />);

  const connector = props.connectors.filter(c => c.id === id)[0];
  if (connector) {
    const service = props.services.filter(s => s.id === connector.service)[0];
    if (service) {
      return (
        <div className="center service-form">
          <Link to="/connectors"><h4>Back</h4></Link>
          <br />
          <img className="service-icon-big" src={service.icon_url} alt={service.name} />
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
          <Link to="/connectors">Back to connectors</Link><br />
          <h2 className="service-description">Connector : {connector.schema}</h2>
          <p>Id : {connector.id}</p>
          <p>Status : {connector.status.setup_state}</p>
        </div>
      );
    }
  }
  return (<h2>Oops! Connector with id {id} not found :(</h2>)
}
