import axios from 'axios';
import moment from 'moment';

import { handleQueryParams } from '../utils/query';
import query from 'devextreme/data/query';


const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export async function list(token, queryParams) {

  // Calculate dynamic sample size based on time period
  const start_date = moment(queryParams.start_date);
  const end_date = moment(queryParams.end_date);
  const hours_difference = end_date.diff(start_date, 'hours');
  const base_sample_rate = 4 / 24;
  queryParams.sample_size = Math.max(1, Math.round(hours_difference * base_sample_rate));

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
