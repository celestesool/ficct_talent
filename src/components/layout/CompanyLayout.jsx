import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';

export const CompanyLayout = () => {
  return (
    <div className="company-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};