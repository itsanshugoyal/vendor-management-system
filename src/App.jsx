import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VendorManagement from './pages/VendorManagement';
import FleetManagement from './pages/FleetManagement';
import DriverManagement from './pages/DriverManagement';

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendors" element={<VendorManagement />} />
          <Route path="/fleet" element={<FleetManagement />} />
          <Route path="/drivers" element={<DriverManagement />} />
        </Routes>
      </main>
    </div>
  );
}