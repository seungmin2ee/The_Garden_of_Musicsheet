import './layout.module.scss';
import { Outlet } from 'react-router-dom';
import { Footer, Header } from '../../UI/organisms';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
