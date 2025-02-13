import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddVendorModal from "./AddVendorModal";

function VendorList({ vendors }) {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Vendor Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Region</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sub Vendors</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Active Fleet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{vendor.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.type}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.region}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.subVendors}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.activeFleet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VendorHierarchy({ vendors }) {
  const VendorNode = ({ vendor }) => (
    <li>
      <strong>{vendor.name}</strong> ({vendor.type})
      {vendor.children && vendor.children.length > 0 && (
        <ul className="ml-4 list-disc">
          {vendor.children.map((child) => (
            <VendorNode key={child.id} vendor={child} />
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="mt-4">
      <ul>
        {vendors.map((vendor) => (
          <VendorNode key={vendor.id} vendor={vendor} />
        ))}
      </ul>
    </div>
  );
}

const initialVendors = [
  {
    id: 1,
    name: "Super Vendor A",
    type: "Super Vendor",
    region: "National",
    subVendors: 5,
    activeFleet: 45,
    children: [
      {
        id: 3,
        name: "Regional Vendor A",
        type: "Regional Vendor",
        region: "North",
        subVendors: 3,
        activeFleet: 20,
        children: [
          {
            id: 5,
            name: "City Vendor A1",
            type: "City Vendor",
            region: "North",
            subVendors: 1,
            activeFleet: 8,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Regional Vendor B",
    type: "Regional Vendor",
    region: "South",
    subVendors: 2,
    activeFleet: 28,
    children: [],
  },
];

export default function VendorManagement() {
  const [vendors, setVendors] = useState(initialVendors);
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'hierarchy'
  const [showModal, setShowModal] = useState(false);

  const handleAddVendor = (newVendor) => {
    newVendor.id = vendors.length + 1;
    newVendor.subVendors = 0;
    newVendor.activeFleet = 0;
    newVendor.children = [];
    setVendors([...vendors, newVendor]);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Vendor Management</h1>
          <p className="mt-2 text-sm text-gray-700">Manage your vendors, their hierarchies, and permissions</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <PlusIcon className="inline-block h-5 w-5 mr-1" />
            Add Vendor
          </button>
        </div>
      </div>
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("list")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "list"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab("hierarchy")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hierarchy"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Hierarchy View
            </button>
          </nav>
        </div>
        {activeTab === "list" ? <VendorList vendors={vendors} /> : <VendorHierarchy vendors={vendors} />}
      </div>
      {showModal && <AddVendorModal onClose={() => setShowModal(false)} onSubmit={handleAddVendor} />}
    </div>
  );
}
