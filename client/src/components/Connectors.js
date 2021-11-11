import React from "react";
import {
  Link,
} from "react-router-dom";

import { LoadingIndicator } from "./LoadingIndicator";

export function Connectors(props) {
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
            <Link key={item.id} to={`/connectors/${item.id}`}>
              <div className="service-item">
                <img className="service-icon" src={service.icon_url} alt={service.name} />
                <h3 className="service-description">
                  {item.schema}
                </h3>
              </div>
            </Link>);
        } else {
          return (
            <Link key={item.id} to={`/connectors/${item.id}`}>
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
  return <LoadingIndicator />;
}
