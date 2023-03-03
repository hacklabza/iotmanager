import axios from 'axios';

import { handleQueryParams } from '../utils/query';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export async function list(token, queryParams) {
  const queryString = handleQueryParams(queryParams);
  const path = queryString ? `devices/?${queryString}` : 'devices/'
  return axios.get(`${apiBaseUrl}/${path}`, {
    headers: {
      Authorization: `Token ${token}`
    }
  }).then(
    (response) => {
      return response.data.results;
    }
  );
}

export async function detail(token, device_id) {
  return axios.get(`${apiBaseUrl}/devices/${device_id}/`, {
    headers: {
      Authorization: `Token ${token}`
    }
  }).then(
    (response) => {
      return response.data
    }
  );
}

export async function create(token, device) {
  return axios.post(`${apiBaseUrl}/devices/`, device, {
    headers: {
      Authorization: `Token ${token}`
    }
  }).then(
    (response) => {
      return response.data
    }
  );
}

export async function update(token, device_id, device) {
  return axios.patch(`${apiBaseUrl}/devices/${device_id}/`, device, {
    headers: {
      Authorization: `Token ${token}`
    }
  }).then(
    (response) => {
      return response.data
    }
  );
}

export async function remove(token, device_id) {
  return axios.delete(`${apiBaseUrl}/devices/${device_id}/`, {
    headers: {
      Authorization: `Token ${token}`
    }
  }).then(
    (response) => {
      return response.data
    }
  );
}
