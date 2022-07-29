import { useState, useEffect, memo, useMemo } from 'react';
import { Modal, Title } from '@mantine/core';

// import tempratureColors from '../../temprature-colors';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

import CircularTempSlider from 'components/ServerRoom/CircularTempSlider';
import RoomTemprature from 'components/ServerRoom/RoomTemprature';
import PowerBtn from 'components/ServerRoom/PowerBtn';
import LockStatus from 'components/ServerRoom/LockStatus';
import AirTemprature from 'components/ServerRoom/AirTemprature';

import { useFloor } from 'contexts/FloorContext';

function ThermostatModal({ isModalVisible, closeModal, thermostat_id, thermostats }) {
  const { floor } = useFloor();
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`L${floor}/S/+/${thermostat_id}`);
    subscribe(`L${floor}/HZ/F/ON`);

    onMessage((message) => {
      console.log('NewMessage:ThermostatModal', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => {
      unsubscribe(`L${floor}/S/+/${thermostat_id}`);
      unsubscribe(`L${floor}/HZ/F/ON`);
    };
  }, [thermostat_id, floor]);

  const {
    settedTemperature,
    powerStatus,
    powerStatusIsChangeable,
    roomTemprature,
    coolingStatus,
    lockData,
  } = useMemo(() => {
    return getData(thermostat_id, serviceData, floor);
  }, [thermostat_id, serviceData, floor]);

  const thermostat = useMemo(() => {
    return thermostats.find((item) => item.id === thermostat_id);
  }, [thermostat_id, thermostats]);

  return (
    <Modal opened={isModalVisible} onClose={closeModal} hideCloseButton centered>
      <>
        <div className="modal-head">
          <Title order={4}>{thermostat && thermostat.text}</Title>
          <RoomTemprature roomTemprature={roomTemprature} coolingStatus={coolingStatus} />
          <PowerBtn
            id={thermostat_id}
            powerStatusIsChangeable={!powerStatusIsChangeable}
            powerStatus={powerStatus}
            publish_prefix={`L${floor}/S`}
            thermostat={thermostat}
          />
        </div>

        <CircularTempSlider
          id={thermostat_id}
          settedTemperature={settedTemperature}
          publish_prefix={`L${floor}/S`}
        />

        <LockStatus
          lockData={lockData}
          id={thermostat_id}
          publish_prefix={`L${floor}/S`}
          value={serviceData[`L${floor}_S_${thermostat_id}_LOCK_R`]}
        />

        <div className='air_temp_container'>
          <AirTemprature
            value={serviceData[`L${floor}_S_${thermostat_id}_T1_R`]}
            text="T1"
          />
          <AirTemprature
            value={serviceData[`L${floor}_S_${thermostat_id}_T2_R`]}
            text="T2"
          />
          <AirTemprature
            value={serviceData[`L${floor}_S_${thermostat_id}_T3_R`]}
            text="T3"
          />
          <AirTemprature
            value={serviceData[`L${floor}_S_${thermostat_id}_T4_R`]}
            text="T4"
          />
        </div>
      </>
      
    </Modal>
  );
}

const getData = (thermostat_id, serviceData, floor) => {
  const roomTempratureKey = `L${floor}_S_${thermostat_id}_RT_R`;
  const coolingStatusKey = `L${floor}_S_${thermostat_id}_MODE_R`;
  const powerStatusKey = `L${floor}_S_${thermostat_id}_ON_R`;
  const powerStatusIsChangeableKey = `L${floor}_HZ_F_ON`;
  const fanSpeedKey = `L${floor}_S_${thermostat_id}_FS_R`;
  const tempratureSetKey = `L${floor}_S_${thermostat_id}_SET_R`;
  const lockStatusKey = `L${floor}_S_${thermostat_id}_LOCK_R`;
//L1_S_01_T1_R

  const roomTemprature = serviceData.hasOwnProperty(roomTempratureKey)
    ? serviceData[roomTempratureKey] / 10
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
    ? serviceData[tempratureSetKey] / 10
    : null;

  const lockData = serviceData.hasOwnProperty(lockStatusKey) ? serviceData[lockStatusKey] : null;


  return {
    roomTemprature,
    powerStatus,
    coolingStatus,
    fanSpeed,
    settedTemperature,
    lockData,
    AirTemprature,
    powerStatusIsChangeable,
  };
};

export default memo(ThermostatModal);
