import { useState, useCallback, useEffect, useMemo } from 'react';
import PreactionSprinkModal from './PreactionSprinkModal';
import sensors from './sensors';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import ZoomArea from 'components/ZoomArea';
import FloorPlanImage from 'components/FloorPlanImage';
import { useFloor } from 'contexts/FloorContext';

function PreactionSprinks() {
  const { floor } = useFloor();

  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, sensor_id: null });

  useEffect(() => {
    subscribe(`L${floor}/F/SENSOR/#`);

    onMessage((message) => {
      console.log('PreactionSprinks:', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`L${floor}/F/SENSOR/#`);
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

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />

          {sensorList.map((item, i) => {
            const key = `L${floor}_Fire_${item.id}`;
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
                  onClick={() => leakStatus !== 1 && showModal(item.id)}
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
        </div>
      </ZoomArea>

      {modal.isVisible && (
        <PreactionSprinkModal
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

export default PreactionSprinks;
