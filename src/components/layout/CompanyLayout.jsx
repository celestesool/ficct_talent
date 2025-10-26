import { Outlet } from 'react-router-dom';

export const CompanyLayout = () => {
  return (
    <div className="company-layout">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};