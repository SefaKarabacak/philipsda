import { Paper } from '@mantine/core';

function AuthLayout({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#2c2e33',
      }}
    >
      <Paper size="lg" shadow="xs" radius="xs" padding={'lg'} withBorder style={{ width: 380 }}>
        {children}
      </Paper>
    </div>
  );
}

export default AuthLayout;
