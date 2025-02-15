import { useState } from "react";
import useFleetStore from "../store/fleetStore";

export default function VehicleForm({ vendorId, onClose }) {
  const addVehicle = useFleetStore((state) => state.addVehicle);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    model: "",
    seatingCapacity: "",
    fuelType: "",
    documents: {
      rc: { number: "", expiryDate: "" },
      permit: { number: "", expiryDate: "" },
      pollution: { number: "", expiryDate: "" },
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVehicle({ ...formData, vendorId });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Registration Number</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.registrationNumber}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Seating Capacity</label>
        <input
          type="number"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.seatingCapacity}
          onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={formData.fuelType}
          onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="CNG">CNG</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.rc.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      rc: { ...formData.documents.rc, number: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.rc.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      rc: { ...formData.documents.rc, expiryDate: e.target.value },
                    },
                  })
                }
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.permit.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      permit: { ...formData.documents.permit, number: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.permit.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      permit: { ...formData.documents.permit, expiryDate: e.target.value },
                    },
                  })
                }
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.pollution.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      pollution: { ...formData.documents.pollution, number: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.documents.pollution.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documents: {
                      ...formData.documents,
                      pollution: { ...formData.documents.pollution, expiryDate: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

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
          Add Vehicle
        </button>
      </div>
    </form>
  );
}
