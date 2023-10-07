import React from 'react';

import Chart, {
  Legend,
  Point,
  Series,
  Tooltip
} from 'devextreme-react/chart';
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
  return (
    <ResponsiveBox singleColumnScreen="xs sm">
      <Row ratio={1} />

      {
        Object.keys(currentStatusData).map(() => {
          return <Col ratio={1} />
        })
      }

      {
        Object.keys(currentStatusData).map((key, index) => {
          const label = currentStatusData[key].label;
          const colour = currentStatusData[key].display.colour;
          const icon = currentStatusData[key].icon;
          const status = currentStatusData[key].value;
          return (
            <Item>
              <Location
                row={0}
                col={index}
                colspan={1}
              ></Location>
              <Location
                row={0}
                ratio={2}
                col={index}
                colspan={1}
                screen="md"
              ></Location>
              <div className={"box-hero " + colour}>
                <i className={"dx-icon-custom dx-icon-white dx-icon-" + icon + " float-left"}></i>
                <p class="header item">{label.toUpperCase()}</p>
                <h3>{status}</h3>
              </div>
            </Item>
          );
        })
      }
    </ResponsiveBox>
  )
}

const historicalStatusContent = (deviceHistoricalStatusDataStore, displayData, key) => {
  const colourMap = {
    blue: "#1db2f5",
    red: "#f5564a",
    green: "#97c95c",
    yellow: "#ffc720",
    orange: "#ff9800",
  };

  return (
    <Chart
      id="historicalStatusChart"
      dataSource={deviceHistoricalStatusDataStore}
    >
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

const renderContent = (deviceData, deviceHistoricalStatusDataStore) => {
  const displayData = normalizePinDisplayData(deviceData);
  const currentStatusData = normalizeCurrentStatus(deviceData);
  if (currentStatusData && displayData) {
    return (
      <ScrollView height="100%" width="100%">
        <div id="statusPopupContent">
          <p className="header item float-right text-upper">
            Updated <Moment fromNow>{currentStatusData.created_at}</Moment>
          </p>
          <p className="header item float-right text-upper">
            Some switch
          </p>
          <div id="currentStatusContent">
            {currentStatusContent(currentStatusData.statuses)}
          </div>
          <p></p>
          {
            Object.keys(displayData).map(key => {
              return (
                <div id="historicalStatusContent">
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

  const queryParams = null;

  const deviceHistoricalStatusStore = new CustomStore({
    key: 'id',
    load: (loadOptions) => {
      return getDeviceStatusList(user.token, queryParams);
    }
  });

  const deviceHistoricalStatusDataStore = new DataSource({
    store: deviceHistoricalStatusStore,
    map: (itemData) => {
      return normalizeHistoricalStatus(deviceData, itemData);
    }
  });

  return (
    <Popup
      id="devicePopup"
      title={`${deviceData ? deviceData.name : ""} Stats`}
      width="90vw"
      height="80vh"
      deferRendering={true}
      showCloseButton={true}
      visible={showDeviceData}
      contentRender={() => renderContent(deviceData, deviceHistoricalStatusDataStore)}
      onHiding={(event) => {
        setShowDeviceData(false);
      }}
    />
  );
}
