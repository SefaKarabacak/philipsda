import { useState, useEffect, memo } from 'react';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import { Modal, Title } from '@mantine/core';
import alarm from 'assets/alarm.gif';

function PreactionAlarm() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serviceData, setServiceData] = useState({});
  const [alarmed, setAlarmed] = useState([]);

  useEffect(() => {
    subscribe('+/F/SENSOR/+');

    onMessage((message, topic) => {
      if (topic.includes('/F/SENSOR/')) {
        setServiceData((m) => ({ ...m, ...message }));
      }
    });

    return () => unsubscribe('+/F/SENSOR/+');
  }, []);

  useEffect(() => {
    const filteredByValue = Object.fromEntries(
      Object.entries(serviceData).filter(([key, value]) => key.includes('Fire') && value === 1),
    );

    const filtered = Object.keys(filteredByValue);
    setAlarmed(filtered);

    if (filtered.length > 0) {
      setIsModalVisible(true);
    }
  }, [serviceData]);

  const handleCancel = () => {
    setIsModalVisible(false);

    setTimeout(() => {
      setIsModalVisible(true);
    }, 30000);
  };

  return (
    <>
      {alarmed.length > 0 && (
        <Modal title="Alarm" opened={isModalVisible} onClose={handleCancel} footer={null} centered>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Title order={4}>The preaction sprinks below exploded.</Title>
            {alarmed.map((item, i) => {
              const text = item.split('_');

              return (
                <div key={i}>
                  <strong>
                    Floor {text[0][1]}, {text[2] === '1' ? 'Electrical Room' : 'Server Room'}
                  </strong>
                </div>
              );
            })}
            <img src={alarm} style={{ width: '50%', marginTop: 20 }} alt="" />
          </div>
        </Modal>
      )}
    </>
  );
}

export default memo(PreactionAlarm);
