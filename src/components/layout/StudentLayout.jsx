import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';

export const StudentLayout = () => {
  return (
    <div className="student-layout">
      <Navbar />
      <main className="main-content">
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </main>
    </div>
  );
};