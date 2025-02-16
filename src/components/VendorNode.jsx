import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon, KeyIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import useVendorStore from "../store/vendorStore";
import useFleetStore from "../store/fleetStore";
import useDriverStore from "../store/driverStore";
import PermissionsModal from "./PermissionModal";
import VendorForm from "./VendorForm";

const VendorNode = ({ vendor, depth = 0, onAddSubVendor }) => {
  // Local state for managing UI interactions
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Store actions for updating vendor status and delegating authority
  const updateVendorStatus = useVendorStore((state) => state.updateVendorStatus);
  const delegateAuthority = useVendorStore((state) => state.delegateAuthority);

  // Retrieve all fleet and driver data
  const allVehicles = useFleetStore((state) => state.vehicles);
  const allDrivers = useDriverStore((state) => state.drivers);

  // Memoized filtering of vehicles and drivers related to the current vendor
  const vehicles = useMemo(() => allVehicles.filter((v) => v.vendorId === vendor.id), [allVehicles, vendor.id]);
  const drivers = useMemo(() => allDrivers.filter((d) => d.vendorId === vendor.id), [allDrivers, vendor.id]);

  // Check if vendor has child vendors
  const hasChildren = vendor.children && vendor.children.length > 0;

  // Handle adding a sub-vendor
  const handleAddSubVendor = (newVendorData) => {
    try {
      onAddSubVendor(vendor.id, newVendorData);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add sub-vendor:", error);
    }
  };

  // Handle delegation of authority to child vendors
  const handleDelegateAuthority = (permissions) => {
    try {
      if (vendor.type === "Super Vendor") {
        vendor.children.forEach((child) => {
          delegateAuthority(vendor.id, child.id, permissions);
        });
      }
    } catch (error) {
      console.error("Failed to delegate authority:", error);
    }
  };

  // Memoize child vendors for performance optimization
  const memoizedChildren = useMemo(
    () => (vendor.children || []).filter((child) => child && child.id !== vendor.id),
    [vendor.children, vendor.id]
  );

  // Compute total fleet size recursively, including child vendors
  const totalFleetSize = useMemo(() => {
    const calculateFleetSize = (vendor) => {
      let size = vehicles.length;
      if (vendor.children) {
        vendor.children.forEach((child) => {
          size += calculateFleetSize(child);
        });
      }
      return size;
    };
    return calculateFleetSize(vendor);
  }, [vendor, vehicles]);

  return (
    <>
      {/* Table row representing the vendor */}
      <tr className={clsx(depth > 0 && "bg-gray-50")}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
          <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
            {/* Expand/collapse button if the vendor has children */}
            {hasChildren && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2 text-gray-500 hover:text-gray-700">
                {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
              </button>
            )}
            {!hasChildren && <span className="w-6" />}
            {vendor.name}
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.type}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{vendor.region}</td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {/* Status indicator with different colors for active/inactive status */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {vendor.status}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {totalFleetSize} vehicles / {drivers.length} drivers
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {/* Action buttons for permissions, adding sub-vendors, and toggling status */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsPermissionsModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <KeyIcon className="h-5 w-5" />
            </button>
            {vendor.type !== "Local Vendor" && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="text-green-600 hover:text-green-900"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
            {vendor.status === "Active" ? (
              <button
                type="button"
                onClick={() => updateVendorStatus(vendor.id, "Suspended")}
                className="text-red-600 hover:text-red-900"
              >
                Suspend
              </button>
            ) : (
              <button
                type="button"
                onClick={() => updateVendorStatus(vendor.id, "Active")}
                className="text-green-600 hover:text-green-900"
              >
                Activate
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Form for adding a sub-vendor under the current vendor */}
      {showAddForm && (
        <tr>
          <td colSpan="6" className="px-6 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Sub-vendor under {vendor.name}</h3>
              <VendorForm parentVendor={vendor} onSubmit={handleAddSubVendor} onClose={() => setShowAddForm(false)} />
            </div>
          </td>
        </tr>
      )}

      {/* Recursively render child vendors if expanded */}
      {isExpanded &&
        memoizedChildren.map((child) => (
          <VendorNode key={child.id} vendor={child} depth={depth + 1} onAddSubVendor={onAddSubVendor} />
        ))}

      {/* Permissions modal for delegating authority */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        vendor={vendor}
        onDelegateAuthority={handleDelegateAuthority}
      />
    </>
  );
};

export default VendorNode;
