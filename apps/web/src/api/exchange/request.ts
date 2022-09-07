import axios from 'axios';
import { apiBaseUrl } from 'utils/constant';

export const getPairList = async () => {
  const { data } = await axios.post(apiBaseUrl + '/bb/symbol/list', {
    leverage: 'ALL',
  });

  return data?.data?.pairs;
};
