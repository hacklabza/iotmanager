import React from 'react';
import moment from 'moment';

import Chart, { Legend, Series } from 'devextreme-react/chart';
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
import { normalizeStatuses } from '../../utils/normalize';
import { list as getDeviceStatusList } from '../../api/device-status';
import './DevicePopup.scss';


const currentStatusContent = (currentStatusData) => {
  const heroColourMap = ['blue', 'red', 'green', 'orange', 'yellow']
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
          let status = currentStatusData[key];
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
              <div className={"box-hero " + heroColourMap[index]}>
                <p className="header item">{key.toUpperCase()}</p>
                <h3>{status}</h3>
              </div>
            </Item>
          );
        })
      }
    </ResponsiveBox>
  )
}

const historicalStatusContent = (deviceHistoricalStatusDataStore) => {
  return (
    <Chart
      palette="Material"
      id="historicalStatusChart"
      dataSource={deviceHistoricalStatusDataStore}
    >
      <Series
        valueField="humidity"
        argumentField="createdAt"
        name="Humidity"
        type="bar" />
      <Series
        valueField="temperature"
        argumentField="createdAt"
        name="Temperature"
        type="bar"/>
      <Series
        valueField="lightSensor"
        argumentField="createdAt"
        name="Light Sensor"
        type="bar"/>

      <Legend verticalAlignment="bottom" horizontalAlignment="center" columnCount={3}></Legend>
    </Chart>
  );
}

const renderContent = (data, deviceHistoricalStatusDataStore) => {
  const currentStatusData = normalizeStatuses(data);
  if (currentStatusData) {
    return (
      <ScrollView height="100%" width="100%">
        <div id="statusPopupContent">
          <p className="header item float-right text-upper">
            Updated <Moment fromNow>{currentStatusData.createdAt}</Moment>
          </p>
          <div id="currentStatusContent">
            {currentStatusContent(currentStatusData.statuses)}
          </div>
          <p></p>
          <div id="historicalStatusContent">
            {historicalStatusContent(deviceHistoricalStatusDataStore)}
          </div>
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
      return {
        createdAt: moment(itemData.created_at).format('HH:mm'),
        lightSensor: itemData.status['light-sensor'],
        temperature: itemData.status['dht-sensor'].temperature,
        humidity: itemData.status['dht-sensor'].humidity,
      }
    }
  })

  return (
    <Popup
      id="devicePopup"
      deferRendering={true}
      title={`${deviceData ? deviceData.name : ""} Stats`}
      showCloseButton={true}
      visible={showDeviceData}
      contentRender={() => renderContent(deviceData, deviceHistoricalStatusDataStore)}
      onHiding={(event) => {
        setShowDeviceData(false);
      }}
    />
  );
}
