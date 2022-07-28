import { TextInput, PasswordInput, Button, Title } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import { useForm } from '@mantine/hooks';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Login() {
  const history = useHistory();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
    },
  });

  const notifications = useNotifications();

  const onSubmit = ({ username, password }) => {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAuthenticated', true);
      history.push('/');
      return window.location.reload('/');
    }

    notifications.showNotification({
      title: 'Error',
      message: 'Username or password are incorrect.',
      autoClose: 5000,
      color: 'red',
    });
  };

  return (
    <div>
      <div className="logo-wrapper">
        <img src={logo} alt="" className="logo" />
        <Title order={6} mb={12} align="center">
          Mechanical Automation
        </Title>
      </div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          placeholder="username"
          name="username"
          value={form.username}
          {...form.getInputProps('username')}
        />
        <PasswordInput
          placeholder="password"
          name="password"
          mt={5}
          required
          value={form.password}
          {...form.getInputProps('password')}
        />
        <Button variant="light" mt={5} fullWidth onClick={form.onSubmit(onSubmit)}>
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
