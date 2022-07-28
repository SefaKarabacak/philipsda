import { useEffect, useState } from 'react';
import { Table, TimePicker, Checkbox } from 'antd';
import moment from 'moment';
import { subscribe, unsubscribe, onMessage, publish } from '../../mqtt-service';

const format = 'HH:mm';

const days = [
  {
    id: '01',
    name: 'Monday',
  },
  {
    id: '02',
    name: 'Tuesday',
  },
  {
    id: '03',
    name: 'Wednesday',
  },
  {
    id: '04',
    name: 'Thursday',
  },
  {
    id: '05',
    name: 'Friday',
  },
  {
    id: '06',
    name: 'Saturday',
  },
  {
    id: '07',
    name: 'Sunday',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
  },
];

function Program({ topic_prefix, payload_prefix, title }) {
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    subscribe(`${topic_prefix}/#`);

    onMessage((message) => {
      console.log(message);
      setServiceData((m) => ({ ...m, ...message }));
    });

    return () => unsubscribe(`${topic_prefix}/#`);
  }, [topic_prefix]);

  const daysObject = days.map((day) => ({
    title: day.name,
    dataIndex: day.name.toLocaleLowerCase(),
    key: day.name.toLocaleLowerCase(),
    render: (text, record) => (
      <Checkbox
        checked={serviceData[`${payload_prefix}_${day.id}`] === 1 ? true : false}
        onChange={(e) => {
          publish(
            `${topic_prefix}/${day.id}`,
            `{"${payload_prefix}_${day.id}": ${e.target.checked ? 1 : 0}}`,
          );
        }}
      />
    ),
  }));

  const start_time = insertStringToIndex(serviceData[`${payload_prefix}_ONTIME`], 2, ':');
  const end_time = insertStringToIndex(serviceData[`${payload_prefix}_OFFTIME`], 2, ':');

  const columns = [
    ...daysObject,
    {
      title: 'Start Time',
      key: 'start-time',
      render: () => (
        <>
          <TimePicker
            onChange={(time, timeString) => {
              publish(
                `${topic_prefix}/ONTIME`,
                `{"${payload_prefix}_ONTIME": ${parseInt(timeString.replace(':', ''))}}`,
              );
            }}
            value={moment(start_time ? start_time : '00:00', format)}
            format={format}
            allowClear={false}
          />
        </>
      ),
    },
    {
      title: 'End Time',
      key: 'end-time',
      render: () => (
        <TimePicker
          onChange={(time, timeString) => {
            publish(
              `${topic_prefix}/OFFTIME`,
              `{"${payload_prefix}_OFFTIME": ${parseInt(timeString.replace(':', ''))}}`,
            );
          }}
          value={moment(end_time ? end_time : '00:00', format)}
          format={format}
          allowClear={false}
        />
      ),
    },
    {
      title: 'Is Active',
      key: 'is-active',
      render: (text, record) => (
        <Checkbox
          checked={serviceData[`${payload_prefix}_ON`] === 1 ? true : false}
          onChange={(e) => {
            publish(`${topic_prefix}/ON`, `{"${payload_prefix}_ON": ${e.target.checked ? 1 : 0}}`);
          }}
        />
      ),
    },
  ];

  return (
    <div className="program">
      <h2>{title}</h2>
      <Table columns={columns} dataSource={data} bordered pagination={false} />
    </div>
  );
}

const insertStringToIndex = (str, index, value) => {
  if (!str) {
    return false;
  }

  let s = String(str);

  for (let i = s.length; i < 4; i++) {
    s = '0' + s;
  }

  return s.substr(0, index) + value + s.substr(index);
};

export default Program;
