# api-sample-code-project-js
Sample Code Project for PBF customers using React frontend and Express backend.

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