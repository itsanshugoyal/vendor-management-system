import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddCabModal({ onClose, onSubmit }) {
  const [cabData, setCabData] = useState({
    cabNumber: "",
    model: "",
    seatingCapacity: "",
    fuelType: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCabData({ ...cabData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cabData.cabNumber || !cabData.model || !cabData.seatingCapacity || !cabData.fuelType) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    onSubmit(cabData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Cab</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Cab Number:
            <input
              type="text"
              name="cabNumber"
              value={cabData.cabNumber}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter cab number"
            />
          </label>
          <label className="block mb-2">
            Model:
            <input
              type="text"
              name="model"
              value={cabData.model}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter cab model"
            />
          </label>
          <label className="block mb-2">
            Seating Capacity:
            <input
              type="number"
              name="seatingCapacity"
              value={cabData.seatingCapacity}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter seating capacity"
            />
          </label>
          <label className="block mb-2">
            Fuel Type:
            <input
              type="text"
              name="fuelType"
              value={cabData.fuelType}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter fuel type"
            />
          </label>
          <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
