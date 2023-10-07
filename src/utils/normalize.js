import moment from 'moment';


const UNIT_TYPE_MAP = {
  percentage: '%',
  celsius: 'ºC',
  fahrenheit: 'ºF',
  millibar: 'Mbar',
  hectopascal: 'hPa',
  meter: 'm',
  boolean: (value) => value > 0 ? "ON" : "OFF",
};


const formatUnit = (key, value, displayData) => {
  const displayOptions = displayData[key];
  const unit_type = UNIT_TYPE_MAP[displayOptions.unit_of_measure];

  if (typeof(unit_type) == 'function') {
    return unit_type(value);
  } else {
    return `${value.toFixed(1)}${unit_type}`;
  }
};

export const normalizePinDisplayData = (deviceData) => {
  const displayData = {};
  deviceData.pins.forEach((pin) => {
    pin.display.forEach(display => {
      if (display.visible) {
        displayData[display.value] = display
      }
    })
  });
  return displayData;
};

export const normalizeStatus = (statuses, displayData, appendUnit = true) => {
  const currentStatuses = {};

  Object.keys(statuses).forEach((key) => {
    const status = statuses[key];
    if (typeof status === 'object') {
      Object.keys(status).forEach((nested_key) => {
        const composite_key = `${key}.${nested_key}`;
        if (displayData[composite_key]) {
          currentStatuses[composite_key] = {
            label: displayData[composite_key].label,
            display: displayData[composite_key],
            icon: displayData[composite_key].icon,
            value: appendUnit ? formatUnit(
              composite_key, status[nested_key], displayData
            ) : status[nested_key]
          };
        }
      });
    } else {
      if (displayData[key]) {
        currentStatuses[key] = {
          label: displayData[key].label,
          display: displayData[key],
          icon: displayData[key].icon,
          value: appendUnit ? formatUnit(
            key, status, displayData
          ) : status
        };
      }
    }
  });
  return currentStatuses;
}

export const normalizeCurrentStatus = (deviceData) => {
  if (deviceData && deviceData.last_status && deviceData.last_status.created_at) {
    const created_at = deviceData.last_status.created_at;
    const displayData = normalizePinDisplayData(deviceData);
    const statuses = normalizeStatus(deviceData.last_status.status, displayData);
    return {
      created_at,
      statuses,
    };
  } else {
    return null;
  }
};

export const normalizeHistoricalStatus = (deviceData, historicalStatus) => {
  const displayData = normalizePinDisplayData(deviceData);
  const statuses = normalizeStatus(historicalStatus.status, displayData, false);
  const status = {
    created_at: moment(historicalStatus.created_at).format("HH:mm")
  }
  Object.keys(statuses).forEach(key => {
    if (displayData[key]) {
      status[key] = statuses[key].value;
    }
  });
  return status;
};
