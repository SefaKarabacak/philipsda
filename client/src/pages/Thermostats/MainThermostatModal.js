import { useMemo, useState } from 'react';
import {
  Modal,
  Switch,
  Title,
  Button,
  Select,
  Progress,
  LoadingOverlay,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { publish } from '../../mqtt-service';
import { useFloor } from 'contexts/FloorContext';
import thermostats from './thermostats';

const publishData = (floor, id, values) => {
  // power status
  const powerValue = values.power ? 1 : 4;
  publish(
    `L${floor}/F/ON/${id}`,
    `{"L${floor}_F_${id}_ON_WR": ${powerValue},"L${floor}_F_${id}_ON_R": ${powerValue}}`,
  );

  // set temperature
  const setTempValue = Number(values.setTemperature) * 50;
  publish(
    `L${floor}/F/SET/${id}`,
    `{"L${floor}_F_${id}_SET_WR": ${setTempValue},"L${floor}_F_${id}_SET_R": ${setTempValue}}`,
  );

  // fan speed
  const fanSpeed = values.fanSpeed;
  publish(
    `L${floor}/F/FS/${id}`,
    `{"L${floor}_F_${id}_FS_WR": ${fanSpeed},"L${floor}_F_${id}_FS_R": ${fanSpeed}}`,
  );

  // lock status
  const lockValue = values.lockStatus;
  publish(
    `L${floor}/F/LOCK/${id}`,
    `{"L${floor}_F_${id}_LOCK_WR": ${lockValue},"L${floor}_F_${id}_LOCK_R": ${lockValue}}`,
  );
};

const MainThermostatModal = ({ isModalVisible, closeModal }) => {
  const { floor } = useFloor();
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      power: false,
      setTemperature: '16',
      fanSpeed: '0',
      lockStatus: '0',
    },
  });

  const thermostat = useMemo(
    () => thermostats[floor - 1].filter((item) => !item.ignoreBatch),
    [floor],
  );

  const onSubmit = (values) => {
    setLoading(true);
    setCompleted([]);

    // eslint-disable-next-line array-callback-return
    thermostat.map((item, i) => {
      setTimeout(() => {
        publishData(floor, item.id, values);
        setCompleted((c) => [...c, { id: item.id, text: item.text }]);

        if (i === thermostat.length - 1) {
          setLoading(false);
        }
      }, i * 1000);
    });
  };

  const CompletedTasks = () => {
    const val = (100 * completed.length) / thermostat.length;

    const label =
      completed.length === thermostat.length
        ? 'Completed'
        : `Processing ${completed[completed.length - 1].text}...`;

    return (
      <div style={{ margin: '40px 0' }}>
        <Title align="center" order={5}>
          {completed.length !== thermostat.length && `${completed.length}/${thermostat.length}`}
        </Title>

        <Progress radius="xs" size="lg" my={10} value={val} striped animate />

        <Title align="center" order={6}>
          {label}
        </Title>
      </div>
    );
  };

  return (
    <Modal
      opened={isModalVisible}
      onClose={closeModal}
      title="Main Thermostat"
      centered
      overflow="inside"
      closeOnEscape={false}
      closeOnClickOutside={!loading}
      hideCloseButton={loading}
    >
      <div style={{ width: 400, position: 'relative' }}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <div className="modal_list_item">
            <div>
              <Title order={6}>Power</Title>
            </div>
            <div>
              <Switch size="md" {...form.getInputProps('power', { type: 'checkbox' })} />
            </div>
          </div>

          <div className="modal_list_item">
            <div>
              <Title order={6}>Set Temperature</Title>
            </div>
            <div>
              <Select
                placeholder="Pick one"
                size="xs"
                data={[
                  { value: '16', label: '16' },
                  { value: '17', label: '17' },
                  { value: '18', label: '18' },
                  { value: '19', label: '19' },
                  { value: '20', label: '20' },
                  { value: '21', label: '21' },
                  { value: '22', label: '22' },
                  { value: '23', label: '23' },
                  { value: '24', label: '24' },
                  { value: '25', label: '25' },
                  { value: '26', label: '26' },
                  { value: '27', label: '27' },
                  { value: '28', label: '28' },
                  { value: '29', label: '29' },
                  { value: '30', label: '30' },
                ]}
                {...form.getInputProps('setTemperature', { type: 'select' })}
              />
            </div>
          </div>

          <div className="modal_list_item">
            <div>
              <Title order={6}>Fan Speed</Title>
            </div>
            <div>
              <Select
                placeholder="Pick one"
                size="xs"
                data={[
                  { value: '0', label: 'Auto' },
                  { value: '33', label: 'Low' },
                  { value: '66', label: 'Mid' },
                  { value: '100', label: 'High' },
                ]}
                {...form.getInputProps('fanSpeed', { type: 'select' })}
              />
            </div>
          </div>

          <div className="modal_list_item">
            <div>
              <Title order={6}>Lock Status</Title>
            </div>
            <div>
              <Select
                placeholder="Pick one"
                size="xs"
                data={[
                  { value: '0', label: 'Unlock' },
                  { value: '1', label: 'Lock buttons (+ / -)' },
                  { value: '2', label: 'Lock fan button only' },
                  { value: '3', label: 'Lock operating button only' },
                  { value: '4', label: 'Lock all buttons' },
                ]}
                {...form.getInputProps('lockStatus', { type: 'select' })}
              />
            </div>
          </div>

          <Group position="right">
            <Button type="submit" size="xs" color="primary">
              Submit
            </Button>
          </Group>
        </form>

        <LoadingOverlay visible={loading} />
      </div>

      {completed.length > 0 && loading && <CompletedTasks />}
    </Modal>
  );
};

export default MainThermostatModal;
