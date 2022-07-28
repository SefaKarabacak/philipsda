import { useState, useCallback, useEffect, useMemo } from 'react';
import WaterLeakagesModal from './WaterLeakagesModal';
import sensors, { waterSwitchBtns } from './sensors';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';
import ZoomArea from 'components/ZoomArea';
import FloorPlanImage from 'components/FloorPlanImage';
import { useFloor } from 'contexts/FloorContext';
import { Button } from '@mantine/core';

function WaterLeakages() {
  const { floor } = useFloor();

  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, sensor_id: null });

  useEffect(() => {
    subscribe(`L${floor}/W/SENSOR/#`);

    onMessage((message) => {
      console.log('WaterLeakages:', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`L${floor}/W/SENSOR/#`);
  }, [floor]);

  const showModal = useCallback((sensor_id) => {
    setModal((m) => ({ ...m, isVisible: true, sensor_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  // wSensor_id_CKG

  const sensorList = useMemo(() => {
    return sensors[floor - 1] || [];
  }, [floor]);

  const water_on_off = serviceData[`L${floor}_W_ON_OFF`] || null;

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />

          {sensorList.map((item, i) => {
            const key = `L${floor}_WS_${item.id}_CKG`;
            const leakStatus = serviceData.hasOwnProperty(key) ? serviceData[key] : null;

            return (
              <div
                className="modal-btn-container"
                style={{
                  left: item.position.x,
                  top: item.position.y,
                }}
                key={i}
              >
                <button
                  onClick={() => showModal(item.id)}
                  className="modal-btn knv"
                  style={{
                    backgroundColor: leakStatus === 1 ? 'red' : 'green',
                  }}
                >
                  {item.text}
                </button>
              </div>
            );
          })}

          <div
            className="modal-btn-container"
            style={{
              left: waterSwitchBtns[floor - 1].position.x,
              top: waterSwitchBtns[floor - 1].position.y,
            }}
          >
            <Button
              onClick={() => {
                publish(
                  `L${floor}/W/SENSOR/ON`,
                  `{"L${floor}_W_ON_OFF": ${water_on_off === 1 ? 0 : 1}}`,
                );
              }}
            >
              {water_on_off === 1 ? 'OFF' : 'ON'}
            </Button>
          </div>
        </div>
      </ZoomArea>

      {modal.isVisible && (
        <WaterLeakagesModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          sensor_id={modal.sensor_id}
          sensors={sensorList}
          floor={floor}
        />
      )}
    </>
  );
}

export default WaterLeakages;
