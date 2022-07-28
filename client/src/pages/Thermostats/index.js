import { useState, useEffect, useCallback, useMemo } from 'react';
import ZoomArea from 'components/ZoomArea';
import { subscribe, unsubscribe, onMessage } from '../../mqtt-service';
import thermostats from './thermostats';
import ThermostatModal from './ThermostatModal';
import MainThermostatModal from './MainThermostatModal';
import tempratureColors from '../../temprature-colors';
import FloorPlanImage from 'components/FloorPlanImage';
import { useFloor } from 'contexts/FloorContext';

const tempColors = tempratureColors;

function Thermostats({ onlyServerRooms }) {
  const { floor } = useFloor();
  const [serviceData, setServiceData] = useState({});
  const [modal, setModal] = useState({ isVisible: false, thermostat_id: null });
  const [isVisibleMainThermostatModal, setIsVisibleThermostatModal] = useState(false);

  useEffect(() => {
    subscribe(`L${floor}/F/RT/#`);

    onMessage((message) => {
      console.log('message', message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`L${floor}/F/RT/#`);
  }, [floor]);

  const showModal = useCallback((thermostat_id, isMain) => {
    if (isMain) {
      return setIsVisibleThermostatModal(true);
    }

    setModal((m) => ({ ...m, isVisible: true, thermostat_id }));
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, isVisible: false }));
  }, []);

  const thermostatList = useMemo(() => {
    const t = thermostats[floor - 1] || [];

    if (onlyServerRooms) {
      return t.filter((item) => item.isServerRoom);
    }

    return t;
  }, [floor, onlyServerRooms]);

  return (
    <>
      <ZoomArea>
        <div className="container">
          <FloorPlanImage />

          {thermostatList.map((item, i) => {
            const roomTemprature = serviceData.hasOwnProperty(`L${floor}_F_${item.id}_RT_R`)
              ? serviceData[`L${floor}_F_${item.id}_RT_R`] / 50
              : null;

            const tColor = tempColors[Math.ceil(roomTemprature - 16)];

            return (
              <div
                className="modal-btn-container"
                style={{ left: item.position.x, top: item.position.y }}
                key={i}
              >
                <div
                  className={`title ${item.isMain ? 'main_thermostat' : ''}`}
                  onClick={() => showModal(item.id, item.isMain)}
                >
                  {item.text}
                </div>

                {roomTemprature ? (
                  <button
                    onClick={() => showModal(item.id, item.isMain)}
                    className="modal-btn"
                    style={{
                      backgroundColor: roomTemprature ? '#' + tColor : '',
                    }}
                  >
                    <span>{roomTemprature} °C</span>
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </ZoomArea>

      {modal.isVisible && (
        <ThermostatModal
          isModalVisible={modal.isVisible}
          closeModal={closeModal}
          thermostat_id={modal.thermostat_id}
          thermostats={thermostatList}
        />
      )}

      {isVisibleMainThermostatModal && (
        <MainThermostatModal
          isModalVisible={isVisibleMainThermostatModal}
          closeModal={() => setIsVisibleThermostatModal(false)}
        />
      )}
    </>
  );
}

export default Thermostats;
