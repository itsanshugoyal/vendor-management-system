import { useState } from "react";

const vendorTypes = ["Super Vendor", "Regional Vendor", "City Vendor", "Local Vendor"];

const VendorForm = ({ onSubmit, onClose, parentVendor = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: parentVendor ? getNextVendorType(parentVendor.type) : "Super Vendor",
    region: "",
    permissions: {
      fleetManagement: true,
      driverOnboarding: true,
      paymentProcessing: false,
      bookingManagement: true,
      subVendorManagement: false,
    },
  });

  function getNextVendorType(currentType) {
    const currentIndex = vendorTypes.indexOf(currentType);
    return currentIndex < vendorTypes.length - 1 ? vendorTypes[currentIndex + 1] : vendorTypes[currentIndex];
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      level: parentVendor ? parentVendor.level + 1 : 1,
      parentId: parentVendor?.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Vendor Type</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          {vendorTypes.slice(vendorTypes.indexOf(formData.type)).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Region</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Initial Permissions</label>
        {Object.entries(formData.permissions).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  permissions: {
                    ...formData.permissions,
                    [key]: e.target.checked,
                  },
                })
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
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
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Vendor
        </button>
      </div>
    </form>
  );
};

export default VendorForm;
