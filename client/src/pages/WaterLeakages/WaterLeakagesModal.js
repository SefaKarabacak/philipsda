import { memo, useEffect, useState, useMemo } from 'react';
import { Modal, Alert } from '@mantine/core';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';

function WaterLeakagesModal({ isModalVisible, closeModal, sensor_id, sensors, floor }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`L${floor}/W/SENSOR/${sensor_id}`);

    onMessage((message) => {
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`L${floor}/W/SENSOR/${sensor_id}`);
  }, [sensor_id, floor]);

  const sensorKey = `L${floor}_WS_${sensor_id}_CKG`;
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
        Has no any water leakages.
      </Alert>
    </Modal>
  );
}

export default memo(WaterLeakagesModal);
