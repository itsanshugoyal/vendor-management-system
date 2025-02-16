import { useState, useEffect } from "react";
import useFleetStore from "../store/fleetStore";

export default function VehicleForm({ vendorId, vehicle, onClose, onSubmit }) {
  // Retrieve actions from the fleet store
  const addVehicle = useFleetStore((state) => state.addVehicle);
  const updateVehicle = useFleetStore((state) => state.updateVehicle);

  // Initialize form state with defaults; prefill if editing a vehicle
  const [formData, setFormData] = useState({
    registrationNumber: vehicle ? vehicle.registrationNumber : "",
    model: vehicle ? vehicle.model : "",
    seatingCapacity: vehicle ? vehicle.seatingCapacity : "",
    fuelType: vehicle ? vehicle.fuelType : "",
    documents: {
      rc: {
        number: vehicle?.documents?.rc?.number || "",
        expiryDate: vehicle?.documents?.rc?.expiryDate || "",
      },
      permit: {
        number: vehicle?.documents?.permit?.number || "",
        expiryDate: vehicle?.documents?.permit?.expiryDate || "",
      },
      pollution: {
        number: vehicle?.documents?.pollution?.number || "",
        expiryDate: vehicle?.documents?.pollution?.expiryDate || "",
      },
    },
  });

  // Update formData if vehicle prop changes (for editing mode)
  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        model: vehicle.model,
        seatingCapacity: vehicle.seatingCapacity,
        fuelType: vehicle.fuelType,
        documents: {
          rc: {
            number: vehicle.documents?.rc?.number || "",
            expiryDate: vehicle.documents?.rc?.expiryDate || "",
          },
          permit: {
            number: vehicle.documents?.permit?.number || "",
            expiryDate: vehicle.documents?.permit?.expiryDate || "",
          },
          pollution: {
            number: vehicle.documents?.pollution?.number || "",
            expiryDate: vehicle.documents?.pollution?.expiryDate || "",
          },
        },
      });
    }
  }, [vehicle]);

  // Generic change handler for top-level form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Change handler for nested document fields
  const handleDocumentChange = (docType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: { ...prev.documents[docType], [field]: value },
      },
    }));
  };

  // Form submission handler for adding/updating vehicle
  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicleData = { ...formData, vendorId };
    if (vehicle) {
      updateVehicle(vehicle.id, vehicleData);
    } else {
      addVehicle(vehicleData);
    }
    if (onSubmit) onSubmit(vehicleData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Registration Number Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Registration Number</label>
        <input
          type="text"
          required
          name="registrationNumber"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.registrationNumber}
          onChange={handleChange}
        />
      </div>

      {/* Model Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input
          type="text"
          required
          name="model"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.model}
          onChange={handleChange}
        />
      </div>

      {/* Seating Capacity Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Seating Capacity</label>
        <input
          type="number"
          required
          name="seatingCapacity"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.seatingCapacity}
          onChange={handleChange}
        />
      </div>

      {/* Fuel Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
        <select
          name="fuelType"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.fuelType}
          onChange={handleChange}
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="CNG">CNG</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>

        {/* RC Details */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700">RC Details</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">RC Number</label>
              <input
                type="text"
                required
                name="rcNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.rc.number}
                onChange={(e) => handleDocumentChange("rc", "number", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                name="rcExpiry"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.rc.expiryDate}
                onChange={(e) => handleDocumentChange("rc", "expiryDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Permit Details */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700">Permit Details</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Permit Number</label>
              <input
                type="text"
                required
                name="permitNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.permit.number}
                onChange={(e) => handleDocumentChange("permit", "number", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                name="permitExpiry"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.permit.expiryDate}
                onChange={(e) => handleDocumentChange("permit", "expiryDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Pollution Certificate Details */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700">Pollution Certificate Details</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
              <input
                type="text"
                required
                name="pollutionNumber"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.pollution.number}
                onChange={(e) => handleDocumentChange("pollution", "number", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                name="pollutionExpiry"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.pollution.expiryDate}
                onChange={(e) => handleDocumentChange("pollution", "expiryDate", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          {vehicle ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}
