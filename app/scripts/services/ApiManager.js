const { API_BASE_URL } = global;
const version = 'v1';

const handleResponse = (d) => {
  if (d.status >= 200 && d.status <= 300) {
    let data;
    try {
      data = d.json();
    } catch (e) {
      data = d.text();
    }
    return data;
  }
  throw new Error(d.statusText);
};

class API {
  constructor(baseUrl, config) {
    this.config = { ...config };
    this.baseURL = baseUrl;
  }

  get(endpoint, params) {
    const url = `${this.baseURL}/${version}/${endpoint}${params ? `?${params}` : ''}`;
    return fetch(url, this.config).then(handleResponse);
  }
  getWithAuth(endpoint, params, token) {
    const url = `${this.baseURL}/${endpoint}${params ? `?${params}` : ''}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        client: 'front'
      }
    }).then(handleResponse);
  }
  delete(endpoint, token) {
    const url = `${this.baseURL}/${version}/${endpoint}`;
    return fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        client: 'front',
        'Content-Type': 'application/json; charset=utf-8'
      },
    }).then(handleResponse);
  }

  post(endpoint, body, token) {
    console.log(body);
    const url = `${this.baseURL}/${version}/${endpoint}`;
    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        client: 'front',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }).then(handleResponse);
  }
  put(endpoint, body, token) {
    console.log(body);
    const url = `${this.baseURL}/${version}/${endpoint}`;
    return fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        client: 'front',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }).then(handleResponse);
  }
  patch(endpoint, body, token) {
    console.log(body);
    const url = `${this.baseURL}/${version}/${endpoint}`;
    return fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        client: 'front',
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }).then(handleResponse);
  }
}

const config = {
  headers: {
    client: 'front'
  }
};

export default new API(API_BASE_URL, config);
