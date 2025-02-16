import { useState, useEffect } from "react";
import useDriverStore from "../store/driverStore";
import useFleetStore from "../store/fleetStore";

export default function DriverForm({ vendorId, driver, onClose, onSubmit }) {
  const addDriver = useDriverStore((state) => state.addDriver);
  const vehicles = useFleetStore((state) => state.vehicles);

  // Initialize form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleId: "",
    documents: {
      license: { number: "", expiryDate: "" },
    },
  });

  // Populate form if editing an existing driver
  useEffect(() => {
    if (driver) {
      setFormData(driver);
    }
  }, [driver]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (driver) {
      onSubmit({ ...formData, vendorId }); // Update existing driver
    } else {
      addDriver({ ...formData, vendorId }); // Add new driver
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Driver Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Driver Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Phone Number Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          required
          pattern="[0-9]{10}"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      {/* Vehicle Selection Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Assign Vehicle</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.vehicleId}
          onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.registrationNumber} - {vehicle.model}
            </option>
          ))}
        </select>
      </div>

      {/* Driver's Document Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>

        {/* Driving License Details */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700">Driving License Details</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            {/* License Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.license.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      license: { ...formData.documents.license, number: e.target.value },
                    },
                  })
                }
              />
            </div>

            {/* License Expiry Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.license.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      license: { ...formData.documents.license, expiryDate: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex justify-end space-x-3">
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
          {driver ? "Update Driver" : "Add Driver"}
        </button>
      </div>
    </form>
  );
}
