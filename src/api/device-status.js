import axios from 'axios';
import moment from 'moment';

import { handleQueryParams } from '../utils/query';


const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export async function list(token, queryParams) {
  queryParams = queryParams || {
    created_at: moment().format('YYYY-MM-DD')
  }
  const queryString = handleQueryParams(queryParams);
  let path = queryString ? `devices/statuses/?${queryString}` : 'devices/statuses/'
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

export async function detail(token, status_id) {
  return axios.get(`${apiBaseUrl}/devices/statuses/${status_id}/`, {
    headers: {
      Authorization: `Token ${token}`
    }
  }).then(
    (response) => {
      return response.data
    }
  );
}
