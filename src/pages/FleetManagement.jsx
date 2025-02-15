import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import useFleetStore from "../store/fleetStore";
import VehicleForm from "../components/VehicleForm";
import { format } from "date-fns";

export default function FleetManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const vehicles = useFleetStore((state) => state.vehicles);

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your fleet of vehicles and their documentation</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Add Vehicle
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Registration Number
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Model</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Documents Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {vehicle.registrationNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vehicle.model}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <span className="space-y-1">
                        <p>
                          RC:{" "}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              vehicle.documents.rc.status === "Valid"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vehicle.documents.rc.status}
                          </span>
                        </p>
                        <p>
                          Permit:{" "}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              vehicle.documents.permit.status === "Valid"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vehicle.documents.permit.status}
                          </span>
                        </p>
                        <p>
                          Pollution:{" "}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              vehicle.documents.pollution.status === "Valid"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vehicle.documents.pollution.status}
                          </span>
                        </p>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vehicle.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Vehicle</h2>
            <VehicleForm
              vendorId={3} // This should come from the current vendor context
              onClose={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
