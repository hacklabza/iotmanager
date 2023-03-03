const formMetric = (key, value) => {
  const unit_type_map = {
    humidity: '%',
    temperature: 'ºC',
    'status-led': 'on-off',
    'light-sensor': '%',
  };
  const unit_type = unit_type_map[key];
  if (unit_type === 'on-off') {
    return value > 0 ? "ON" : "OFF"
  } else {
    return `${value.toFixed(1)}${unit_type}`
  }
}

export const normalizeStatuses = (data) => {
  let createdAt = null;
  let statuses = null;
  try {
    createdAt = data.last_status.created_at;
    statuses = data.last_status.status;
  } catch {
    return null;
  }
  const currentStatuses = {}
  Object.keys(statuses).forEach((key) => {
    const status = statuses[key];
    if (typeof status === 'object') {
      Object.keys(status).forEach((nested_key) => {
        currentStatuses[nested_key] = formMetric(nested_key, status[nested_key])
      });
    } else {
      currentStatuses[key] = formMetric(key, status)
    }
  });
  return {
    createdAt: createdAt,
    statuses: currentStatuses,
  };
};
