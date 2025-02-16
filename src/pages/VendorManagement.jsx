import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import useVendorStore from "../store/vendorStore";
import VendorNode from "../components/VendorNode";
import VendorForm from "../components/VendorForm";

export default function VendorManagement() {
  // Retrieve vendors from the store and manage modal visibility
  const vendors = useVendorStore((state) => state.vendors);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Retrieve actions to add vendors and sub-vendors from the store
  const addVendor = useVendorStore((state) => state.addVendor);
  const addSubVendor = useVendorStore((state) => state.addSubVendor);

  // Handler for adding a new super vendor
  const handleAddVendor = (vendorData) => {
    try {
      addVendor(vendorData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add vendor:", error);
    }
  };

  // Handler for adding a sub-vendor under a parent vendor
  const handleAddSubVendor = (parentId, vendorData) => {
    try {
      addSubVendor(parentId, vendorData);
    } catch (error) {
      console.error("Failed to add sub-vendor:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header Section with Title and Description */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vendor Management</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your vendor hierarchy, permissions, and operations</p>
        </div>
        {/* Button to open the modal for adding a new super vendor */}
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Add Super Vendor
          </button>
        </div>
      </div>

      {/* Modal for Adding a New Super Vendor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Super Vendor</h2>
            <VendorForm onSubmit={handleAddVendor} onClose={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Vendor Network Overview Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Vendor Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Region</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fleet Size</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              {/* Table Body: Render each vendor recursively using VendorNode */}
              <tbody className="divide-y divide-gray-200 bg-white">
                {vendors.map((vendor) => (
                  <VendorNode key={vendor.id} vendor={vendor} onAddSubVendor={handleAddSubVendor} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
