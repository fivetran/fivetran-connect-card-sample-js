import fetch from 'node-fetch'

class ApiClient {
    constructor(baseUrl, apiKey, apiSecret){
        function b64encode( str ) {
            return Buffer.from(unescape(encodeURIComponent( str ))).toString('base64');
        }
        this.auth = 'Basic ' + b64encode(apiKey + ':' + apiSecret);
        this.baseUrl = baseUrl;
    }

    request(method, path, data) { return new Request(this.baseUrl, this.auth, method, path, null, data) }

    async getMetadata(){ return await this.request('GET', '/metadata/connectors', null).executePaged(200); }

    async getListOfConnectorsInGroup(group) { return await this.request('GET', '/groups/' + group + '/connectors', null).executePaged(1000); }

    async createConnector(service, group, name) {
        return await this.request(
            'POST', 
            '/connectors', 
            {
                service: service,
                group_id: group, 
                config: {
                    schema: name,
                    table: name,
                    schema_prefix: name
                }
            }
        ).executeSingle();
    }

    async getConnectCardUrlForConnector(id) {
        return this.request('POST', '/connectors/' + id + '/connect-card-token', {}).executeSingle()
            .then( body => {
                return 'https://fivetran.com/connect-card/setup?auth=' + body.token;
            }).catch(e => {
                throw Error("Can't get the connect-card-token for connector: " + e);
            })
    }
}

class Request {
    constructor(baseUrl, auth, method, path, queryParams, data){
        this.baseUrl = baseUrl;
        this.path = path,
        this.queryParams = queryParams,

        this.params = {
            method: method,
            mode: 'cors',
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Authorization': auth,
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        };
        
        if (data) {
            this.params.headers['Content-Type'] = 'application/json';
            this.params.body = JSON.stringify(data);
        }
    }

    async execute() {
        const url = this.baseUrl + this.path + (() => {
            if (this.queryParams && Object.entries(this.queryParams).length > 0) {
                let result = '?';
                for(let param in this.queryParams){
                    result += param + '=' + this.queryParams[param] + '&';
                }
                return result.slice(0, -1);
            }
            return '';
        })();
        const response = await fetch(url, this.params);
        return response;
    }

    async executeSingle() {
        const response = await this.execute();
        const body = await response.json();

        if (response.status >= 400) {
            throw Error(body.message); 
        }
        if (!body.data)
            return body;

        return body.data;
    }

    async executePaged(limitValue) {
        if (!this.queryParams)
            this.queryParams = {};
        
        this.queryParams.limit = limitValue
        const response = await this.execute();
        const body = await response.json();

        if (response.status >= 400) {
            throw Error(body.message) 
        }
        if(!body.data.items)
            return [];

        let items = body.data.items.slice();
        let cursor = body.data.next_cursor;
    
        while(cursor) {
            this.queryParams.limit = limitValue;
            this.queryParams.cursor = cursor;

            const response = await this.execute();
            const body = await response.json();
    
            if (response.status >= 400) 
                throw Error(body.message);
    
            items = items.concat(body.data.items);
            cursor = body.data.next_cursor;
        }

        return items;
    }
}

export default ApiClient;