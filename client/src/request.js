export const get = async (path) => {
    const response = await fetch(path);
    if(response.status === 200)
      return await response.json();
     
    throw new Error(await response.text());
  }
  
export const post = async (path, data) => {
    const response = await fetch(path, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    if (response.status === 200) 
        return  await response.json();
    
    throw Error(await response.text());
}