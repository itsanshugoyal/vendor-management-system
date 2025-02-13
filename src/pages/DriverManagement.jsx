import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddDriverModal from "./AddDriverModal";

const initialDrivers = [
  {
    id: 1,
    name: "John Doe",
    licenseNumber: "DL123456789",
    vendor: "Super Vendor A",
    vehicle: "KA01AB1234",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    licenseNumber: "DL987654321",
    vendor: "Regional Vendor B",
    vehicle: "MH02CD5678",
    status: "On Leave",
  },
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [showModal, setShowModal] = useState(false);

  const handleAddDriver = (newDriver) => {
    newDriver.id = drivers.length + 1;
    newDriver.status = "Active";
    newDriver.vendor = "TBD";
    newDriver.vehicle = "TBD";
    setDrivers([...drivers, newDriver]);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Driver Management</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your drivers and their assignments</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Add Driver
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Driver Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">License Number</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vendor</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {driver.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.licenseNumber}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.vendor}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.vehicle}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{driver.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <AddDriverModal onClose={() => setShowModal(false)} onSubmit={handleAddDriver} />}
    </div>
  );
}
