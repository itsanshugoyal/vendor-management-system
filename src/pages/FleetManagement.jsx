import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddCabModal from "./AddCabModal";

const initialCabs = [
  {
    id: 1,
    cabNumber: "KA01AB1234",
    model: "Toyota Prius",
    seatingCapacity: 4,
    fuelType: "Petrol",
    status: "Active",
  },
  {
    id: 2,
    cabNumber: "MH02CD5678",
    model: "Honda City",
    seatingCapacity: 4,
    fuelType: "Diesel",
    status: "Inactive",
  },
];

export default function FleetManagement() {
  const [cabs, setCabs] = useState(initialCabs);
  const [showModal, setShowModal] = useState(false);

  const handleAddCab = (newCab) => {
    newCab.id = cabs.length + 1;
    newCab.status = "Active";
    setCabs([...cabs, newCab]);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your fleet and onboard cabs</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Add Cab
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Cab Number</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Model</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seating Capacity</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fuel Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cabs.map((cab) => (
                  <tr key={cab.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {cab.cabNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cab.model}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cab.seatingCapacity}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cab.fuelType}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{cab.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <AddCabModal onClose={() => setShowModal(false)} onSubmit={handleAddCab} />}
    </div>
  );
}
