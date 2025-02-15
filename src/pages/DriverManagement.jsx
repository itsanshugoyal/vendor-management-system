import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import DriverForm from "../components/DriverForm";
import useDriverStore from "../store/driverStore";

export default function DriverManagement() {
  // Get drivers from the Zustand store
  const drivers = useDriverStore((state) => state.drivers);
  const updateDriver = useDriverStore((state) => state.updateDriver);
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Replace with your actual vendorId; using dummy vendorId = 1 for this example
  const vendorId = 1;

  const handleEditClick = (driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedDriver) {
      updateDriver(selectedDriver.id, formData);
    }
    setShowModal(false);
    setSelectedDriver(null);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Driver Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your drivers, onboard new drivers, and assign them to vehicles.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedDriver(null);
              setShowModal(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Add Driver
          </button>
        </div>
      </div>

      {/* Driver List Table */}
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                License Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vendor ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vehicle ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {driver.documents?.license?.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.vendorId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.vehicleId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleEditClick(driver)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg">
            <DriverForm
              vendorId={vendorId}
              driver={selectedDriver}
              onClose={() => setShowModal(false)}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
