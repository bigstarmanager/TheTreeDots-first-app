import { AuthenticationError } from 'apollo-server-errors';
import { MinMaxValue } from './constant';

export function validatorPaging(page, limit) {
  if (page < MinMaxValue.MIN_PAGE || page > MinMaxValue.MAX_PAGE) {
    throw new AuthenticationError(`page is limited from ${MinMaxValue.MIN_PAGE} to ${MinMaxValue.MAX_PAGE}`);
  }
  if (limit < MinMaxValue.MIN_LIMIT || limit > MinMaxValue.MAX_LIMIT) {
    throw new AuthenticationError(
      `limit is limited from ${MinMaxValue.MIN_LIMIT} to ${MinMaxValue.MAX_LIMIT}`
    );
  }
}
