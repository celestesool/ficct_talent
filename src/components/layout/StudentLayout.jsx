import { Outlet } from 'react-router-dom';

export const StudentLayout = () => {
  return (
    <div className="student-layout">
      <main className="main-content">
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </div>
  );
};