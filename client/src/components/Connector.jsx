import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { get, handleError } from '../request';
import { LoadingIndicator } from "./LoadingIndicator";

export function Connector(props) {
  let { id } = useParams();
  const [editLink, setEditLink] = useState(null);
  const [editError, setEditError] = useState(null);
  const [connector, setConnector] = useState(null);
  useEffect(() => {
    const getLink = async () => { 
      try {
        const link = await get(`/_/connectors/${id}/form`);
        setEditLink(`${link.url}&redirect_uri=http://localhost:3000/connectors/${link.connectorId}`)
      } catch(e) {
        setEditError(handleError(e));
      }
    }
    getLink();
  }, [id]);
  useEffect(() => {
    const getConnector = async () => { 
      try {
        const result = await get(`/_/connectors/${id}`);
        setConnector(result);
      } catch(e) {
        setEditError(handleError(e));
      }
    }
    getConnector();
  }, [id]);
  if (!props.connectors || !props.services || !editLink){
    if (editError){
      return (<h2>An error occured: {editError}</h2>);
    }
    return (<LoadingIndicator />);
  }
  if (connector) {
    const service = props.services.filter(s => s.id === connector.service)[0];
    if (service) {
      return (
        <div className="center service-form">
          <Link to="/connectors"><h4>Back</h4></Link>
          <br />
          <img className="service-icon-big" src={service.icon_url} alt={service.name} />
          <h2 className="service-description">Connector : {connector.display_name}</h2>
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
          <h2 className="service-description">Connector : {connector.display_name}</h2>
          <p>Id : {connector.id}</p>
          <p>Status : {connector.status.setup_state}</p>
        </div>
      );
    }
  }
  return (<h2>Oops! Connector with id {id} not found :(</h2>)
}
