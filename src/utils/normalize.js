import moment from 'moment';


const formatUnit = (key, value, displayData) => {
  const unit_type_map = {
    percentage: '%',
    celsius: 'ºC',
    fahrenheit: 'ºF',
    boolean: (value) => value > 0 ? "ON" : "OFF",
  };

  const displayOptions = displayData[key];
  const unit_type = unit_type_map[displayOptions.unit_of_measure];

  if (typeof(unit_type) == 'function') {
    return unit_type(value);
  } else {
    return `${value.toFixed(1)}${unit_type}`;
  }
};

export const normalizePinDisplayData = (deviceData) => {
  const displayData = {};
  deviceData.pins.forEach((pin) => {
    pin.display.forEach(display => displayData[display.value] = display)
  });
  return displayData;
};

export const normalizeStatus = (statuses, displayData, appendUnit = true) => {
  const currentStatuses = {}
  Object.keys(statuses).forEach((key) => {
    const status = statuses[key];
    if (typeof status === 'object') {
      Object.keys(status).forEach((nested_key) => {
        const composite_key = `${key}.${nested_key}`;
        currentStatuses[composite_key] = {
          label: displayData[composite_key].label,
          display: displayData[composite_key],
          value: appendUnit ? formatUnit(
            composite_key, status[nested_key], displayData
          ) : status[nested_key]
        };
      });
    } else {
      currentStatuses[key] = {
        label: displayData[key].label,
        display: displayData[key],
        value: appendUnit ? formatUnit(
          key, status, displayData
        ) : status
      };
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
    status[key] = statuses[key].value
  });
  return status;
};
