
import ApiClient from './api-client.js'
import express from 'express'

//                           'API URL'                      'API-key'           'API-secret'
const client = new ApiClient('https://api.fivetran.com/v1', 'YOUR_API_KEY', 'YOUR_API_SECRET');
const group = 'YOUR_GROUP_ID';

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
       res.status(500).send('Failed to create connect-card-token')
    }
    
})

app.get('/_/connectors', async(req, res) => {
    try {
        const data = await client.getListOfConnectorsInGroup(group)
        res.send(data);
    }
    catch(e){
        console.error(`Error reading connectors: ${e.message}`);
        res.status(500).send('Failed to get connectors list')
     }
})

app.get('/_/connectors/:connectorId/form', async(req, res) => {
    client.getConnectCardUrlForConnector(req.params.connectorId)
        .then( t => res.send(JSON.stringify({ url: t, connectorId: req.params.connectorId})))
        .catch(e => res.status(500).send('Failed to create connect-card-token'));
})

app.post('/_/connectors', async(req, res) => {
    client.createConnector(req.body.service, group, req.body.name)
        .then(c => client.getConnectCardUrlForConnector(c.id)
            .then(t => res.send(JSON.stringify({ url: t, connectorId: c.id})))
            .catch(e => res.status(500).send({message:'Failed to create connect-card-token', error: e})))
        .catch(e => res.status(500).send({message:'Failed to create connector', error: e}));
})

app.listen(5000, () => {
  console.log(`Example app listening at http://localhost:5000`);
})