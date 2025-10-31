import React, { useEffect, useCallback, useMemo, useState } from 'react';
import moment from 'moment';

import Chart, {
  ArgumentAxis,
  Label,
  Legend,
  Point,
  Series,
  Tooltip
} from 'devextreme-react/chart';
import { DateRangeBox } from 'devextreme-react/date-range-box';
import Popup from 'devextreme-react/popup';
import ResponsiveBox, {
  Row,
  Col,
  Item,
  Location,
} from 'devextreme-react/responsive-box';
import ScrollView from 'devextreme-react/scroll-view';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import Moment from 'react-moment';

import { useAuth } from '../../contexts/auth';
import { useDevice } from '../../contexts/device';
import {
  normalizeCurrentStatus,
  normalizeHistoricalStatus,
  normalizePinDisplayData
} from '../../utils/normalize';
import { list as getDeviceStatusList } from '../../api/device-status';
import './DevicePopup.scss';


const currentStatusContent = (currentStatusData) => {
  const statuses = currentStatusData.statuses;
  const aggregations = currentStatusData.aggregations;
  return (
    <ResponsiveBox singleColumnScreen="xs sm">
      <Row ratio={1} />

      {
        Object.keys(statuses).map((key, index) => {
          return <Col key={`col-${key}`} ratio={1} />
        })
      }

      {
        Object.keys(statuses).map((key, index) => {
          const label = statuses[key].label;
          const colour = statuses[key].display.colour;
          const icon = statuses[key].icon;
          const status = statuses[key].value;

          const aggregation_minimum = aggregations[key].minimum.value;
          const aggregation_maximum = aggregations[key].maximum.value;
          const aggregation_average = aggregations[key].average.value;
          return (
            <Item key={key}>
              <Location row={0} col={index}></Location>
              <div className={"box-hero " + colour}>
                <i className={"dx-icon-custom dx-icon-white dx-icon-" + icon + " float-left"}></i>
                <p className={"header item"}>{label.toUpperCase()}</p>
                <h3>{status}</h3>

                <div className="aggregations-container">
                  <div className="aggregation-item">
                    <div className="aggregation-header">MIN</div>
                    <div className="aggregation-value">{aggregation_minimum || 'N/A'}</div>
                  </div>
                  <div className="aggregation-item">
                    <div className="aggregation-header">AVG</div>
                    <div className="aggregation-value">{aggregation_average || 'N/A'}</div>
                  </div>
                  <div className="aggregation-item">
                    <div className="aggregation-header">MAX</div>
                    <div className="aggregation-value">{aggregation_maximum || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </Item>
          );
        })
      }
    </ResponsiveBox>
  )
}

const historicalStatusFilterContent = ({ startDate, endDate, handleDateChange }) => {
  return (
    <DateRangeBox
      startDate={startDate}
      endDate={endDate}
      onValueChanged={
        (event) => {
          handleDateChange(event.value[0], event.value[1]);
        }
      }
      displayFormat="yyyy-MM-dd"
      showClearButton={true}
      applyValueMode="useButtons"
    />
  );
}

const historicalStatusContent = (deviceHistoricalStatusDataStore, displayData, key) => {
  const colourMap = {
    blue: "#1db2f5",
    red: "#f5564a",
    green: "#97c95c",
    yellow: "#ffc720",
    orange: "#ff9800",
    pink: "#e96a94ff",
    purple: "#9c27b0",
  };

  return (
    <Chart
      id="historicalStatusChart"
      dataSource={deviceHistoricalStatusDataStore}
    >
      <ArgumentAxis>
          <Label
              rotationAngle={45}
              overlappingBehavior="rotate"
          />
      </ArgumentAxis>
      <Series
        argumentField="created_at"
        valueField={key}
        name={displayData[key].label}
        type="line"
        color={colourMap[displayData[key].colour]}>
        <Point visible={false} />
      </Series>

      <Legend
        verticalAlignment="bottom"
        horizontalAlignment="center"
        columnCount={1}/>

      <Tooltip
        enabled={true}
        zIndex="2000"
        customizeTooltip={(event) => {
          return { text: event.originalValue.toFixed(1) };
        }}/>
    </Chart>
  );
}

const renderContent = (deviceData, deviceHistoricalStatusDataStore, dateFilterParams) => {
  const displayData = normalizePinDisplayData(deviceData);
  const currentStatusData = normalizeCurrentStatus(deviceData);
  if (currentStatusData && displayData) {
    return (
      <ScrollView height="100%" width="100%">
        <div id="statusPopupContent">
          <p className="header item float-right text-upper">
            Updated <Moment fromNow>{currentStatusData.created_at}</Moment>
          </p>
          <div id="currentStatusContent">
            {currentStatusContent(currentStatusData)}
          </div>
          <p></p>
          <div id="historicalStatusFilterContent">
            {historicalStatusFilterContent(dateFilterParams)}
          </div>
          <p></p>
          {
            Object.keys(displayData).map(key => {
              return (
                <div key={`historicalStatusContent${key}`}>
                  {
                    historicalStatusContent(
                      deviceHistoricalStatusDataStore, displayData, key
                    )
                  }
                </div>
              )
            })
          }
        </div>
      </ScrollView>
    );
  }
};

export default function DevicePopup() {
  const { user } = useAuth();

  const {
    deviceData,
    showDeviceData,
    setShowDeviceData,
  } = useDevice();

  // State for date range
  const [startDate, setStartDate] = useState(moment().subtract(24, 'hours').toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  // Create queryParams with date range
  const queryParams = useMemo(() => ({
    start_date: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
    end_date: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
  }), [startDate, endDate]);

  // Memoize the stores to prevent unnecessary recreations
  const deviceHistoricalStatusStore = useMemo(() => new CustomStore({
    key: 'id',
    load: () => {
      return getDeviceStatusList(user?.token, queryParams);
    }
  }), [user?.token, queryParams]);

  const deviceHistoricalStatusDataStore = useMemo(() => {
    if (!deviceData || !deviceHistoricalStatusStore) {
      return null;
    }
    return new DataSource({
      store: deviceHistoricalStatusStore,
      map: (itemData) => {
        return normalizeHistoricalStatus(deviceData, itemData);
      }
    });
  }, [deviceHistoricalStatusStore, deviceData]);

  const handleDateChange = useCallback((start_date, end_date) => {
    setStartDate(start_date || moment().subtract(24, 'hours').toDate());
    setEndDate(end_date || moment().toDate());
  }, [deviceHistoricalStatusDataStore]);

  const dateFilterParams = {
    startDate,
    endDate,
    handleDateChange,
  }

  return (
    <Popup
      id="devicePopup"
      title={`${deviceData ? deviceData.name : ""} Stats`}
      width="90vw"
      height="80vh"
      deferRendering={true}
      showCloseButton={true}
      visible={showDeviceData}
      contentRender={() => deviceHistoricalStatusDataStore ? renderContent(deviceData, deviceHistoricalStatusDataStore, dateFilterParams) : null}
      onHiding={(event) => {
        setShowDeviceData(false);
      }}
    />
  );
}
