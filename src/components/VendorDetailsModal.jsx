// src/components/VendorDetailsModal.jsx
import React, { useMemo } from "react";
import useFleetStore from "../store/fleetStore";
import useDriverStore from "../store/driverStore";

const VendorDetailsModal = ({ vendor, onClose, onSuspend, onResume }) => {
  if (!vendor) return null;

  // Retrieve all fleet and driver data once
  const allVehicles = useFleetStore((state) => state.vehicles);
  const allDrivers = useDriverStore((state) => state.drivers);

  // Use memoization to prevent repeated filtering that can trigger re-renders
  const vehicles = useMemo(() => {
    return allVehicles.filter((v) => v.vendorId === vendor.id);
  }, [allVehicles, vendor?.id]);

  const drivers = useMemo(() => {
    return allDrivers.filter((d) => d.vendorId === vendor.id);
  }, [allDrivers, vendor?.id]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-900">{vendor.name} Details</h2>
          <button onClick={onClose} className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {/* Vendor Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Vendor Information</h3>
            <dl className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900">{vendor.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Region</dt>
                <dd className="text-sm text-gray-900">{vendor.region}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Fleet Overview */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fleet Overview</h3>
            <dl className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Vehicles</dt>
                <dd className="text-sm text-gray-900">{vehicles.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Active Drivers</dt>
                <dd className="text-sm text-gray-900">{drivers.length}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {vendor.status === "Active" ? (
              <button
                onClick={() => onSuspend(vendor.id)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Suspend Operations
              </button>
            ) : (
              <button
                onClick={() => onResume(vendor.id)}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Resume Operations
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
