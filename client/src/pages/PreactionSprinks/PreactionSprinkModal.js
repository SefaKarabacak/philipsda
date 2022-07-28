import { memo, useEffect, useState, useMemo } from 'react';
import { Modal, Alert } from '@mantine/core';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

function PreactionSprinkModal({ isModalVisible, closeModal, sensor_id, sensors, floor }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`L${floor}/FS/${sensor_id}`);

    onMessage((message) => {
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`L${floor}/FS/${sensor_id}`);
  }, [sensor_id, floor]);

  const sensorKey = `L${floor}_Fire_${sensor_id}`;
  const sensorData = serviceData.hasOwnProperty(sensorKey) ? serviceData[sensorKey] : null;

  const sensor = useMemo(() => {
    return sensors.find((item) => item.id === sensor_id);
  }, [sensor_id, sensors]);

  return (
    <Modal
      title={sensor.text}
      opened={isModalVisible && (sensorData === 0 || sensorData === null)}
      width={400}
      onClose={closeModal}
      centered
    >
      <Alert title="Everything is fine!" color="green">
        Has no any preaction alarm.
      </Alert>
    </Modal>
  );
}

export default memo(PreactionSprinkModal);
