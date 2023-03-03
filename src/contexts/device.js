import React, {
  useState,
  createContext,
  useContext,
} from 'react';


const DeviceContext = createContext({ showDeviceData: false });
const useDevice = () => useContext(DeviceContext);

function DeviceProvider(props) {
  const [deviceData, setDeviceData] = useState(null);
  const [showDeviceData, setShowDeviceData] = useState(false);

  return (
    <DeviceContext.Provider
      value={{ deviceData, showDeviceData, setDeviceData, setShowDeviceData }} {...props}
    />
  );
}

export { DeviceProvider, useDevice }
