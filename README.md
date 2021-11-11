# API Sample Code Project
 
> IMPORTANT: To use this project, you must be a Powered by Fivetran customer. This is a demo project, and you do not need to have an existing React front end or Express back end project.

The API Sample Code Project shows you how to allow your customers to create new and manage existing connectors. You will only create one connector group at a time and there are no auth sessions between the front end and the back end, so all of your customers can see all of the connectors in that group.

## Install & run

1. Install [Node.js and NPM](https://nodejs.org/en/download/).

2. Update the following lines in the `server.js` file. Replace the API Key, API secret, and Group ID fields with your API key, API secret, and Fivetran group ID.

    > TIP: Learn how to find your API key and secret in our [REST API documentation](https://fivetran.com/docs/rest-api/getting-started). You can find your group ID using our public [Postman collection](https://fivetran.com/docs/rest-api/getting-started#postmancollection) or using the [List all groups endpoint](https://fivetran.com/docs/rest-api/groups#listallgroups). If you don't have a group, create one using the [Fivetran Dashboard](https://fivetran.com/account).

    ```
    5  //                           'API URL'                      'API-key'           'API-secret'
    6  const client = new ApiClient('https://api.fivetran.com/v1', 'YOUR_API_KEY', 'YOUR_API_SECRET');
    7  const group = 'YOUR_GROUP_ID';
    ```

3. Navigate to the project directory and run the following commands :

    Install all NPM packages:
    ```
    ~/sample-code-project% npm ci 
    ~/sample-code-project% cd client
    ~/sample-code-project/client% npm ci
    ```

    Start the ExpressJS back end:
    ```
    ~/sample-code-project% cd ..
    ~/sample-code-project% node server.js
    ```

    Run ReactJS front end using a debug server:
    ```
    ~/sample-code-project% cd client
    ~/sample-code-project/client% npm start
    ```

1. Open your browser and go to http://localhost:3000/.

## Code structure

### API client

The core element of this project is `api-client.js`, which is a simple Fivetran API client that we wrote using node-fetch. It consists of two classes:
- Request: A utility wrapper for executing node-fetch requests.
- ApiClient: A default exported class representing the API client. 

The API client has the following methods:
- `getMetadata`: Retrieves metadata for all available connectors. It uses the [Retrieve source metadata endpoint](https://fivetran.com/docs/rest-api/connectors#retrievesourcemetadata).
- `getListOfConnectorsInGroup`: Retrieves all existing connectors in a group. It uses the [List All Connectors within a Group endpoint](https://fivetran.com/docs/rest-api/groups#listallconnectorswithinagroup).
- `createConnector`: Creates a new connector of a specific service type. It uses the [Create a connector endpoint](https://fivetran.com/docs/rest-api/connectors#createaconnector).
- `getConnectCardUrlForConnector`: Returns a Connect Card URL with an auth token that is prepared to create a new or edit an existing connector. It uses the [Connect Card](https://fivetran.com/docs/rest-api/connectors/connect-card) flow.

### Server

`server.js` is a simple Express back-end app. It serves as a proxy between your front end and the Fivetran API. The main purpose of the server is to encapsulate all API-related logic, API secrets, etc. Your customers won't be able to see your actual infrastructure, so you can represent things the way you want.

It has the following defined routes:
- GET `/_/services`: Returns all available service types and related meta-information by service (using display name, icons, doc URLs, etc.)
- GET `/_/connectors`: Returns all existing connectors in a particular group.
- GET `/_/connectors/:connectorId/form`: Returns the URL for the connector's embedded setup form with the connector ID. 
- POST `/_/connectors`: Creates a new connector. Consumes json with all necessary information for connector creation:
    {
        "service":"service_id"
        "name":"connector_name"
    }

To keep things simple, we use `name` as the `schema`, `table`, and `schema_prefix` parameter in the connector creation request payload. Learn more about the connector creation payload in our [REST API connector creation documentation](https://fivetran.com/docs/rest-api/connectors#createaconnector). This logic is encapsulated inside the ApiClient.

> NOTE: The Express back end launches on port 5000. This port is defined as a proxy for ReactApp in `client/package.json`.

### Client

Client is an SPA react application that is based on React Router. Lean more about the overall app structure at `/client/src/PBF-App.js`.

The Client app caches all available connectors on startup (`ComponentDidMount`) and then just uses pre-cached lists. 

Once you create a new connector, you'll be redirected to the Fivetran Setup-form page and then redirected back - so the App component will be reloaded, and cache will be updated. So you'll see you new connector. 
