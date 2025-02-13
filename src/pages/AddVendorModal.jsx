import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddVendorModal({ onClose, onSubmit }) {
  const [vendorData, setVendorData] = useState({
    name: "",
    type: "",
    region: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorData.name || !vendorData.type || !vendorData.region) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    onSubmit(vendorData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-md w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add Vendor</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Vendor Name:
            <input
              type="text"
              name="name"
              value={vendorData.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter vendor name"
            />
          </label>
          <label className="block mb-2">
            Type:
            <select
              name="type"
              value={vendorData.type}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            >
              <option value="">Select Type</option>
              <option value="Super Vendor">Super Vendor</option>
              <option value="Regional Vendor">Regional Vendor</option>
              <option value="City Vendor">City Vendor</option>
              <option value="Local Vendor">Local Vendor</option>
            </select>
          </label>
          <label className="block mb-2">
            Region:
            <input
              type="text"
              name="region"
              value={vendorData.region}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              placeholder="Enter region"
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
