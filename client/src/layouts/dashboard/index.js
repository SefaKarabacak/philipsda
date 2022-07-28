import Header from 'components/Header';
import Nav from 'components/Nav';

function Dashboard({ children }) {
  return (
    <>
      <Nav />
      <div className="container-wrapper">
        <Header />
        {children}
      </div>
    </>
  );
}

export default Dashboard;
