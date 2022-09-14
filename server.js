
import ApiClient from './api-client.js'
import express from 'express'

//                           'API URL'                      'API-key'  'API-secret'
const client = new ApiClient('https://api.fivetran.com/v1', 'API_KEY', 'API_SECRET');
// 'Fivetran Destination ID'
const group = 'GROUP_ID';

// Imitation of connectors storage. In this map we store display names for created connectors.
// In production you can use DB to store all information about created connectors.
const created_connectors = new Map();

// Cached connector names to avoid naming collisions 
const existing_schemas = new Set();

const app = express()
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.get('/_/services', async (req, res) => {
    try {
        const metadata = await client.getMetadata();
        res.send(metadata);
    }
    catch(e){
       console.error(`Error reading metadata: ${e.response.data.message}`);
       res.status(500).send(e.message);
    }
})

app.get('/_/connectors', async(req, res) => {
    try {
        const data = await client.getListOfConnectorsInGroup(group)
        for (const connector of data) {
            if (created_connectors.get(connector.id) != undefined) {
                connector.display_name = created_connectors.get(connector.id)
            } else {
                connector.display_name = connector.schema
                existing_schemas.add(connector.schema.split(".")[0])
                created_connectors.set(connector.id, connector.display_name)
            }
        }
        res.send(data);
    }
    catch(e){
        res.status(500).send(`Error reading connectors: ${e.response.data.message}`);
     }
})

app.get('/_/connectors/:connectorId', async(req, res) => {
    try {
        const connector = await client.getConnector(req.params.connectorId);
        if (created_connectors.get(connector.id) != undefined) {
            connector.display_name = created_connectors.get(connector.id)
        } else {
            connector.display_name = connector.schema
        }
        res.send(connector);
    }
    catch(e){
        res.status(500).send(`Error reading connector: ${e.response.data.message}`);
     }
})

app.get('/_/connectors/:connectorId/form', async(req, res) => {
    try {
        const token = await client.getConnectCardTokenForConnector(req.params.connectorId);
        res.send(JSON.stringify({ url: `https://fivetran.com/connect-card/setup?auth=${token}`, connectorId: req.params.connectorId}))
    } catch(e) {
        res.status(500).send(`Error while retrieving connect-card: ${e.response.data.message}`);
    }
})

app.post('/_/connectors', async(req, res) => {
    try {
        var num = 0;
        var connector_name = req.body.service + "_pbf_sample_" + num;
        while(existing_schemas.has(connector_name)){
            connector_name = req.body.service + "_pbf_sample_" + num;
            num++;
        }
        const connector = await client.createConnector(req.body.service, group, connector_name);
        created_connectors.set(connector.id, req.body.name);
        existing_schemas.add(connector.schema.split(".")[0])
        res.send(connector);
    } catch(e) {
        console.error(`Error while connector creation: ${e.message}`);
        res.status(500).send(e.message);
    }
})

app.listen(5001, () => {
  console.log(`Example app listening at http://localhost:5001`);
})