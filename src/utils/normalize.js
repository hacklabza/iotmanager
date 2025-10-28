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

const normaliseDateInterval = (date) => {
  const rounded = Math.round(moment(date).minute() / 15) * 15;
  return moment(date).minute(rounded).second(0).format("HH:mm");
}

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

export const normalizeAggregations = (aggregations, displayData, appendUnit = true) => {
  const currentAggregations = {};

  Object.keys(aggregations).forEach((key) => {
    const aggregation = aggregations[key];
    Object.keys(aggregation).forEach((aggregation_key) => {
      const stat = aggregation[aggregation_key];
      if (typeof stat === 'object') {
        const composite_key = `${key}.${aggregation_key}`;
        currentAggregations[composite_key] = {};
        Object.keys(stat).forEach((nested_key) => {
          if (displayData[composite_key]) {
            currentAggregations[composite_key][nested_key] = {
              label: nested_key,
              display: displayData[composite_key],
              value: appendUnit ? formatUnit(
                composite_key, stat[nested_key], displayData
              ) : stat[nested_key]
            };
          }
        });
      } else {
        currentAggregations[key] = currentAggregations[key] || {};
        if (displayData[key]) {
          currentAggregations[key][aggregation_key] = {
            label: aggregation_key,
            display: displayData[key],
            value: appendUnit ? formatUnit(
              key, stat, displayData
            ) : stat
          };
        }
      }
    });
  });
  return currentAggregations;
}

export const normalizeCurrentStatus = (deviceData) => {
  if (deviceData && deviceData.last_status && deviceData.last_status.created_at) {
    const created_at = deviceData.last_status.created_at;
    const displayData = normalizePinDisplayData(deviceData);
    const statuses = normalizeStatus(deviceData.last_status.status, displayData);
    const aggregations = normalizeAggregations(deviceData.aggregated_status, displayData);
    return {
      created_at,
      statuses,
      aggregations
    };
  } else {
    return null;
  }
};

export const normalizeHistoricalStatus = (deviceData, historicalStatus) => {
  const displayData = normalizePinDisplayData(deviceData);
  const statuses = normalizeStatus(historicalStatus.status, displayData, false);
  const status = {
    created_at: normaliseDateInterval(moment(historicalStatus.created_at))
  }
  Object.keys(statuses).forEach(key => {
    if (displayData[key]) {
      status[key] = statuses[key].value;
    }
  });
  return status;
};
