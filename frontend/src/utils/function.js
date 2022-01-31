import moment from 'moment';

export const _ = {
  get: function getProp(object, path, defaultVal) {
    if (typeof object !== 'object') {
      return object;
    }
    if (object === null) {
      return defaultVal;
    }
    const _path = Array.isArray(path) ? path : path.split('.').filter((i) => i.length);

    if (!_path.length) {
      return object === undefined ? defaultVal : object;
    }

    return getProp(object[_path.shift()], _path, defaultVal);
  }
};

export const checkObjectEmpty = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;

export const changeTimeStamp = (time) => {
  if (!time) return '';
  let dateTime = !!Number(time) ? new Date(Number(time)) : new Date(time);
  let month = moment(dateTime).format('MMMM');
  let day = moment(dateTime).format('DD');
  let year = moment(dateTime).format('YYYY');
  return `${day} ${month}, ${year}` || '';
};

export const changeTimeDateString = (time) => {
  if (!time) return '';
  let dateTime = new Date(time);
  let month = moment(dateTime).format('MMMM');
  let day = moment(dateTime).format('DD');
  let year = moment(dateTime).format('YYYY');
  return `${day} ${month} ${year}` || '';
};

export const changeHourStamp = (hour) => {
  if (!hour) return '';
  if (!hour.includes('-')) return '';
  let splitted = hour.split('-');
  let hourFrom = Number(splitted[0].slice(0, 2));
  let hourTo = Number(splitted[1].slice(0, 2));
  hourFrom = calculateHour(hourFrom);
  hourTo = calculateHour(hourTo);
  return `${hourFrom} to ${hourTo}` || '';
};

function calculateHour(data) {
  if (data == 12) data = data + 'pm';
  else if (data == 24) data = '0am';
  else if (data > 12) data = data - 12 + 'pm';
  else data = data + 'am';
  return data;
}
export const getDataSupplier = (supplierList) => {
  if (!supplierList) return [];
  let returnData = [];
  //input data contains an array of some tables
  //for each table 'x' of data
  for (var x of supplierList) {
    //for each 'object' of table 'x'
    for (var y of x.jobs) {
      var id = y.td_tenant_id;
      var name = y.supplier_name;
      if (id != null && name != null)
        returnData.push({
          value: id,
          label: name
        });
    }
  }
  console.log('supplier js data: ', returnData);
  returnData = returnData.filter(
    (testdata, index, self) =>
      index === self.findIndex((t) => t.value === testdata.value && t.label === testdata.label)
  );
  return returnData;
};
//https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects

export const getDataWindow = (WindowList) => {
  if (!WindowList) return [];
  let returnData = [];
  //input data contains an array of some tables
  //for each table 'x' of data
  for (var x of WindowList) {
    //for each 'object' of table 'x'
    for (var y of x.jobs) {
      var window = y.delivery_window;
      if (window != null)
        returnData.push({
          value: window,
          label: window
        });
    }
  }
  console.log('window js data: ', returnData);
  returnData = returnData.filter(
    (testdata, index, self) =>
      index === self.findIndex((t) => t.value === testdata.value && t.label === testdata.label)
  );
  return returnData;
};

export const convertTime12to24 = (time12h) => {
  if (!time12h) return '';
  const [time, modifier] = time12h && time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

export const convertTime24to12 = (time24h) => {
  if (!time24h) return '';
  time24h = time24h && time24h.split(':'); // convert to array

  // fetch
  const hours = Number(time24h[0]);
  const minutes = Number(time24h[1]);

  // calculate
  let timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = `0${hours}`.slice(-2);
  } else if (hours > 12) {
    timeValue = `0${hours - 12}`.slice(-2);
  } else if (hours == 0) {
    timeValue = '12';
  }

  timeValue += ':' + `0${minutes}`.slice(-2); // get minutes
  timeValue += hours >= 12 ? ' PM' : ' AM'; // get AM/PM
  return timeValue;
};

export const convertTime24to12Items = (time24h) => {
  if (!time24h) return '';
  time24h = time24h && time24h.split(':'); // convert to array

  // fetch
  const hours = Number(time24h[0]);
  const minutes = Number(time24h[1]);

  // calculate
  let newHour, newMinute, newFormat, newTime;

  if (hours > 0 && hours <= 12) {
    newHour = `0${hours}`.slice(-2);
  } else if (hours > 12) {
    newHour = `0${hours - 12}`.slice(-2);
  } else if (hours == 0) {
    newHour = '12';
  }

  newMinute = `0${minutes}`.slice(-2); // get minutes
  newFormat = hours >= 12 ? 'PM' : 'AM'; // get AM/PM
  newTime = `${newHour}:${newMinute} ${newFormat}`;

  return {
    hour: newHour,
    minute: newMinute,
    format: newFormat,
    time: newTime
  };
};

export const convertTimeTo24h = (time) => {
  if (time.includes('PM')) {
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10) + 12;
    minutes = minutes.split(' ')[0];

    console.log(minutes);
    hours == '24' && minutes != '00' ? (hours = '00') : '';

    return `${hours}:${minutes}:00`;
  }

  return time.split(' ')[0] + ':00';
};

export const downloadFile = async (fileList) => {
  let a = document.createElement('a'); //Create <a>
  for await (const data of fileList) {
    a.href = data.pdf_base64; //Base64 Goes here
    a.download = data.file_name; //File name Here
    a.click(); //Downloaded file
  }
};
