
import ApiClient from './api-client.js'
import express from 'express'

//                           'API URL'                      'API-key'           'API-secret'
const client = new ApiClient('https://api.fivetran.com/v1', 'API_KEY', 'API_SECRET');
const group = 'GROUP_ID';

const app = express()
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.get('/_/services', async (req, res) => {
    try {
        const metadata = await client.getMetadata();
        res.send(metadata);
    }
    catch(e){
       console.error(`Error reading metadata: ${e.message}`);
       res.status(500).send(e.message);
    }
    
})

app.get('/_/connectors', async(req, res) => {
    try {
        const data = await client.getListOfConnectorsInGroup(group)
        res.send(data);
    }
    catch(e){
        res.status(500).send(`Error reading connectors: ${e.message}`);
     }
})

app.get('/_/connectors/:connectorId/form', async(req, res) => {
    try {
        const token = await client.getConnectCardTokenForConnector(req.params.connectorId);
        res.send(JSON.stringify({ url: `https://fivetran.com/connect-card/setup?auth=${token}`, connectorId: req.params.connectorId}))
    } catch(e) {
        res.status(500).send(`Error while retrieving connect-card: ${e.message}`);
    }
})

app.post('/_/connectors', async(req, res) => {
    try {
        const connector = await client.createConnector(req.body.service, group, req.body.name);
        res.send(JSON.stringify({connectorId: connector.id}));
    } catch(e) {
        console.error(`Error while connector creation: ${e.message}`);
        res.status(500).send(e.message);
    }
})

app.listen(5000, () => {
  console.log(`Example app listening at http://localhost:5000`);
})