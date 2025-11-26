import {StatusCode} from 'http-status-codes';
import CustomAPIError from './custom-api';


class NotFound extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCode.NOT_FOUND;
  }
}
export default NotFound;