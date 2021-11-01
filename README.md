# API Sample-Code project
Sample Code Project for PBF customers using React frontend and Express backend.
This sample project shows how you can easily provide your customers an opportunity to create new and manage existing connectors.
For the simplicity - the only one group used and there is no auth sessions between front and back-end, so all the users can see all connectors/services.

## Install & run
First of all you should install Node.js and NPM - https://nodejs.org/en/download/

Edit the server.js file, update the following lines:

```
5  //                           'API URL'                      'API-key'           'API-secret'
6  const client = new ApiClient('https://api.fivetran.com/v1', 'YOUR_API_KEY', 'YOUR_API_SECRET');
7  const group = 'YOUR_GROUP_ID';
```
You should specify your [API-key/API-secret](https://fivetran.com/docs/rest-api/getting-started) and Fivetran `group_id`. 

You can find you group id using our public [postman collection](https://fivetran.com/docs/rest-api/getting-started#postmancollection), via [List all groups](https://fivetran.com/docs/rest-api/groups#listallgroups) endpoint. 


After all set, navigate to the project dir and run the following:

Install all npm packages:
```
~/sample-code-project% npm install 
~/sample-code-project% cd client
~/sample-code-project/client% npm install
```

Start the ExpressJS backend
```
~/sample-code-project% cd ..
~/sample-code-project% node server.js
```

Run ReactJS frontend using debug server 
```
~/sample-code-project% cd client
~/sample-code-project/client% npm start
```

Open your browser and go to http://localhost:3000/ - enjoy.

## Code structure

### API client

The core element is the `api-client.js` - it is a simple Fivetran API client, written using node-fetch. 
It consists of two classes:
- Request - just an utility wrapper for easy node-fetch requests execution
- ApiClient - default exported class representing the API client. 

Api Client has the following methods:
- getMetadata - retrieve all available services metadata. It uses [Retrieve source metadata](https://fivetran.com/docs/rest-api/connectors#retrievesourcemetadata) endpoint.
- getListOfConnectorsInGroup - retrieve all existing connectors in a group. It uses [List All Connectors within a Group](https://fivetran.com/docs/rest-api/groups#listallconnectorswithinagroup)
- createConnector - creates a new connector of a specific service type. It uses [Create a connector](https://fivetran.com/docs/rest-api/connectors#createaconnector) endpoint
- getConnectCardUrlForConnector - returns a connect-card url with auth token prepared to edit a new or existing connector. It uses [Connect-Card](https://fivetran.com/docs/rest-api/connectors/connect-card) flow.

### Server

The `server.js` is a simple Express backend app. It serves as a proxy between you front-end and Fivetran API. The main purpose of the server is to encapsulate all API-related logic, API secrets etc. You customers don't need to know anything about actual infrastructure and you can represent things the way you want.

It has a few routes defined:
- GET `/_/services` - returns all available service-types and related meta-information per service (display-name, icons, doc-urls etc)
- GET `/_/connectors` - return all existing connectors (in this particular case - all connectors in a particular group)
- GET `/_/connectors/:connectorId/form` - returns the URL for embedded setup-form for connector with id == connectorId. 
- POST `/_/connectors` - creates a new connector. Consumes json with all necessary information for connector creation:
    {
        "service":"service_id"
        "name":"connector_name"
    }
NOTE: to keep things simple `name` is used as `schema`, `table` and `schema_prefix` parameter in connector creation request payload. More information about connector creation payload can be found [here](https://fivetran.com/docs/rest-api/connectors#createaconnector). This logic incapsuleted inside the ApiClient.

NOTE: The express backend launches on port 5000 (this port is defined as a proxy for ReactApp in client/package.json)

### Client

Client is a SPA react application, based on React-Route. You can quickly discover overall App structure at `/client/src/PBF-App.js`.

Client app caches all available services and connectors on startup (ComponentDidMount) and then just uses pre-cached lists. 

Once you create a new connector - you'll be redirected to Fivetran Setup-form page and then redirected back - so the App component will be reloaded, and cache will be updated. So you'll see you new connector.
