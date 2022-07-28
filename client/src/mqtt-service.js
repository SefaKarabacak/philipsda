import mqtt from 'mqtt';

const websocketUrl = process.env.REACT_APP_WS_ENDPOINT;

const client = mqtt.connect(websocketUrl);

client.stream.on('connect', () => {
  console.log('Connected');
});

client.stream.on('error', (err) => {
  console.log(`Connection to ${websocketUrl} failed`);
  client.end();
});

function subscribe(topic) {
  const callBack = (err, granted) => {
    if (err) {
      console.error('Subscription request failed');
    }
  };

  return client.subscribe(topic, callBack);
}

function onMessage(callBack) {
  return client.on('message', (topic, message, packet) => {
    callBack(JSON.parse(new TextDecoder('utf-8').decode(message)), topic);
  });
}

function publish(topic, data) {
  client.publish(topic, data, { retain: true });
}

function unsubscribe(topic) {
  client.unsubscribe(topic);

  const listener = client.listeners('message')?.reverse()[0];

  if (listener) {
    client.removeListener('message', listener);
  }
}

function closeConnection() {
  client.end();
}

export { client, subscribe, onMessage, unsubscribe, closeConnection, publish };
