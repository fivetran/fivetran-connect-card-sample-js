import axios from 'axios';

class ApiClient {
    constructor(baseUrl, apiKey, apiSecret){
        this.auth = { username: apiKey, password: apiSecret };
        this.baseUrl = baseUrl;
    }
    async getMetadata(){ 
        return await this.executePaged(`get`, `/metadata/connectors`, 200);
    }

    async getListOfConnectorsInGroup(group) { 
        return await this.executePaged(`get`, `/groups/${group}/connectors`,  1000);
    }

    async createConnector(service, group, name) {
        const responseData = await this.execute(`post`, `/connectors`, 
        {
            service: service,
            group_id: group, 
            config: {
                schema: name,
                table: name,
                schema_prefix: name
            }
        })
        return responseData.data;
    }

    async getConnectCardTokenForConnector(id) {
        const responseData = await this.execute(`post`, `/connectors/${id}/connect-card-token`, {});
        return responseData.token;
    }

    async execute(method, path, data) {
        console.log(`${method}, ${path}`);
        if (data)
            console.log(data);
        const response = await axios({
            method: method,
            baseURL: this.baseUrl,
            url: path,
            auth: this.auth,
            data: data
        });
        console.log(response.status);
        if (response.status >= 400)
            throw Error(response.data);
        
        console.log(response.data);
        return response.data;
    }

    async executePaged(method, path, limit) {
        console.log(`${method}, ${path}`)
        const response = await axios({
            method: method,
            baseURL: this.baseUrl,
            url: path,
            auth: this.auth,
            params: {
                limit: limit
            }
        });
        let cursor = response.data.data.next_cursor;
        let result = response.data.data.items.slice();
        while(cursor){
            console.log(`${method}, ${path}, ${cursor}`);
            const response = await axios({
                method: method,
                baseURL: this.baseUrl,
                url: path,
                auth: this.auth,
                params: {
                    limit: limit,
                    cursor: cursor
                }
            });
    
            if (response.status >= 400){
                console.log(response.data);
                throw Error(response.data);
            }
            cursor = response.data.data.next_cursor;
            result = result.concat(response.data.data.items);
        }
        return result;
    }
}

export default ApiClient;