import React from "react";
import {
  Link,
} from "react-router-dom";
import { LoadingIndicator } from "./LoadingIndicator";

export function Services(props) {
  if (props.services) {
    const services = props.services.map((item) => (
      <Link key={item.id} to={`services/${item.id}`}>
        <div className="service-item">
          <img className="service-icon" src={item.icon_url} alt={item.name} />
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
  return <LoadingIndicator />
}