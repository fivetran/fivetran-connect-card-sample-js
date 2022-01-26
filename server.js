
import ApiClient from './api-client.js'
import express from 'express'

//                           'API URL'                      'API-key'           'API-secret'
const client = new ApiClient('https://api.fivetran.com/v1', 'f5DGD1uF0dxNcdhS', '3or5FPaopLB6LXIMaAqa3UGXLm2ErErS');
const group = '1k56c2c4xlti6';

// Imitation of connectors storage. In this map we store display names for created connectors.
// In production you can use DB to store all information about created connectors.
const created_connectors = new Map();

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
        const connector = await client.createConnector(req.body.service, group, req.body.name);
        created_connectors.set(connector.id, connector.display_name);
        res.send(connector);
    } catch(e) {
        console.error(`Error while connector creation: ${e.message}`);
        res.status(500).send(e.message);
    }
})

app.listen(5000, () => {
  console.log(`Example app listening at http://localhost:5000`);
})