import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: 'Success',
  201: '',
  202: '',
  204: '',
  400: '',
  401: '',
  403: '',
  404: '',
  406: '',
  410: '',
  422: '',
  500: '',
  502: '',
  503: '',
  504: '',
};

const errorHandler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `Error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Error',
      message: 'Error',
    });
  }

  return response;
};

const request = extend({
  errorHandler,
  credentials: 'include',
});
export default request;
