import { useState, useEffect, memo, useMemo } from 'react';
import { Modal, Title } from '@mantine/core';

// import tempratureColors from '../../temprature-colors';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

import RoomTemprature from 'components/RoomTemprature';
import PowerBtn from 'components/PowerBtn';
import { useFloor } from 'contexts/FloorContext';

function ThermostatModal({ isModalVisible, closeModal, thermostat_id, thermostats }) {
  const { floor } = useFloor();
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`L${floor}/F/+/${thermostat_id}`);
    subscribe(`L${floor}/HZ/F/ON`);

    onMessage((message) => {
      console.log('NewMessage:ThermostatModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {
      unsubscribe(`L${floor}/F/+/${thermostat_id}`);
      unsubscribe(`L${floor}/HZ/F/ON`);
    };
  }, [thermostat_id, floor]);

  const {

    powerStatus,
    powerStatusIsChangeable,
    roomTemprature,
    coolingStatus,
 
  } = useMemo(() => {
    return getData(thermostat_id, serviceData, floor);
  }, [thermostat_id, serviceData, floor]);

  const thermostat = useMemo(() => {
    return thermostats.find((item) => item.id === thermostat_id);
  }, [thermostat_id, thermostats]);

  return (
    <Modal opened={isModalVisible} onClose={closeModal} hideCloseButton centered>
      
        <div className="modal-head">
          <Title order={4}>{thermostat && thermostat.text}</Title>
          <RoomTemprature roomTemprature={roomTemprature} coolingStatus={coolingStatus} />
          <PowerBtn
            id={thermostat_id}
            powerStatusIsChangeable={!powerStatusIsChangeable}
            powerStatus={powerStatus}
            publish_prefix={`L${floor}/F`}
            thermostat={thermostat}
          />
        </div>

       
    </Modal>
  );
}

const getData = (thermostat_id, serviceData, floor) => {
  const roomTempratureKey = `L${floor}_F_${thermostat_id}_RT_R`;
  const coolingStatusKey = `L${floor}_F_${thermostat_id}_MODE_R`;
  const powerStatusKey = `L${floor}_F_${thermostat_id}_ON_R`;
  const powerStatusIsChangeableKey = `L${floor}_HZ_F_ON`;
  const fanSpeedKey = `L${floor}_F_${thermostat_id}_FS_R`;
  const tempratureSetKey = `L${floor}_F_${thermostat_id}_SET_R`;
  const lockStatusKey = `L${floor}_F_${thermostat_id}_LOCK_R`;

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 50
    : null;

  const powerStatus = serviceData.hasOwnProperty(powerStatusKey)
    ? serviceData[powerStatusKey]
    : null;

  const powerStatusIsChangeable = serviceData.hasOwnProperty(powerStatusIsChangeableKey)
    ? serviceData[powerStatusIsChangeableKey]
    : null;

  const coolingStatus = serviceData.hasOwnProperty(coolingStatusKey)
    ? serviceData[coolingStatusKey]
    : null;

  const fanSpeed = serviceData.hasOwnProperty(fanSpeedKey) ? serviceData[fanSpeedKey] : null;

  const settedTemperature = serviceData.hasOwnProperty(tempratureSetKey)
    ? serviceData[tempratureSetKey] / 50
    : null;

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;

  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    fanSpeed,
    settedTemperature,
    lockData,
    powerStatusIsChangeable,
  };
};

export default memo(ThermostatModal);
