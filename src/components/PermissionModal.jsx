import { useState } from "react";
import useVendorStore from "../store/vendorStore";

const permissionsList = [
  { id: "fleetManagement", label: "Fleet Management" },
  { id: "driverOnboarding", label: "Driver Onboarding" },
  { id: "paymentProcessing", label: "Payment Processing" },
  { id: "bookingManagement", label: "Booking Management" },
  { id: "subVendorManagement", label: "Sub-vendor Management" },
];

export default function PermissionsModal({ isOpen, onClose, vendor }) {
  const updateVendorPermissions = useVendorStore((state) => state.updateVendorPermissions);
  const [permissions, setPermissions] = useState(vendor?.permissions || {});

  if (!isOpen) return null;

  const handlePermissionChange = (permissionId) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleSave = () => {
    updateVendorPermissions(vendor.id, permissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Manage Permissions for {vendor.name}</h2>
        <div className="space-y-4">
          {permissionsList.map(({ id, label }) => (
            <div key={id} className="flex items-center">
              <input
                type="checkbox"
                id={id}
                checked={permissions[id] || false}
                onChange={() => handlePermissionChange(id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
                {label}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
