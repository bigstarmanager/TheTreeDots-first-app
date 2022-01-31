import dayjs from 'dayjs';

/**
 * Calculate duedate based on creditTerm and format it as the default
 * @param creditTerm
 * @param deliveryDate
 */

export const calDueDate = (creditTerm: number, deliveryDate: string): string => {
  let result = dayjs();
  const DATE_FORMAT = 'YYYY-MM-DD';
  if (creditTerm === 0) {
    // we re-formatted it as the default date value, just to be sure
    result = dayjs(deliveryDate);
  } else if (creditTerm === 7) {
    // Set it to the last day of the week (which is sunday) + 2 days
    result =
      dayjs(deliveryDate).day() === 0
        ? dayjs(deliveryDate).add(2, 'day')
        : dayjs(deliveryDate).day(7).add(2, 'day');
  } else if (creditTerm === 15) {
    // If delivery date falls on 1 ~ 15th --> due on 15th on same month
    // If delivery date 16th ~ end of month --> due on end of same month
    result =
      dayjs(deliveryDate).get('date') <= 15
        ? dayjs(deliveryDate).set('date', 15)
        : dayjs(deliveryDate).endOf('month');
  } else if (creditTerm === 30) {
    // Set it to the last day of the month
    result = dayjs(deliveryDate).add(1, 'month').endOf('month');
  } else {
    // Add it as usual
    result = dayjs(deliveryDate)
      .add(creditTerm || 0, 'day')
      .endOf('month');
  }
  return result.format(DATE_FORMAT);
};

export const getNewDate = () => {
  const curentDateTime = new Date();
  const offset = (curentDateTime.getTimezoneOffset() / 60) * -1;
  curentDateTime.setHours(curentDateTime.getHours() + offset);
  return curentDateTime;
};
