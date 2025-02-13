import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddDriverModal({ onClose, onSubmit }) {
  const [driverData, setDriverData] = useState({
    name: "",
    licenseNumber: "",
    drivingLicense: null,
    vehicleRegistration: null,
    permit: null,
    pollutionCertificate: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setDriverData({ ...driverData, [name]: files[0] });
    } else {
      setDriverData({ ...driverData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverData.name || !driverData.licenseNumber) {
      setError("Please fill in required fields.");
      return;
    }
    setError("");
    onSubmit(driverData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Driver</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Driver Name:
            <input
              type="text"
              name="name"
              value={driverData.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter driver name"
            />
          </label>
          <label className="block mb-2">
            License Number:
            <input
              type="text"
              name="licenseNumber"
              value={driverData.licenseNumber}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter license number"
            />
          </label>
          <label className="block mb-2">
            Driving License:
            <input type="file" name="drivingLicense" onChange={handleChange} className="mt-1 block w-full" />
          </label>
          <label className="block mb-2">
            Vehicle Registration:
            <input type="file" name="vehicleRegistration" onChange={handleChange} className="mt-1 block w-full" />
          </label>
          <label className="block mb-2">
            Permit:
            <input type="file" name="permit" onChange={handleChange} className="mt-1 block w-full" />
          </label>
          <label className="block mb-2">
            Pollution Certificate:
            <input type="file" name="pollutionCertificate" onChange={handleChange} className="mt-1 block w-full" />
          </label>
          <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
