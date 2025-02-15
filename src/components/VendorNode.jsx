import { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon, KeyIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import useVendorStore from "../store/vendorStore";
import useFleetStore from "../store/fleetStore";
import useDriverStore from "../store/driverStore";
import PermissionsModal from "./PermissionModal";
import VendorForm from "./VendorForm";

const VendorNode = ({ vendor, depth = 0, onAddSubVendor }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const updateVendorStatus = useVendorStore((state) => state.updateVendorStatus);
  const delegateAuthority = useVendorStore((state) => state.delegateAuthority);
  const allVehicles = useFleetStore((state) => state.vehicles);
  const allDrivers = useDriverStore((state) => state.drivers);

  // Memoize vehicles and drivers to avoid unnecessary re-renders
  const vehicles = useMemo(() => {
    return allVehicles.filter((v) => v.vendorId === vendor.id);
  }, [allVehicles, vendor.id]);

  const drivers = useMemo(() => {
    return allDrivers.filter((d) => d.vendorId === vendor.id);
  }, [allDrivers, vendor.id]);

  const hasChildren = vendor.children && vendor.children.length > 0;

  const handleAddSubVendor = (newVendorData) => {
    onAddSubVendor(vendor.id, newVendorData);
    setShowAddForm(false);
  };

  const handleDelegateAuthority = (permissions) => {
    if (vendor.type === "Super Vendor") {
      vendor.children.forEach((child) => {
        delegateAuthority(vendor.id, child.id, permissions);
      });
    }
  };

  // Memoize children to avoid unnecessary re-renders
  const memoizedChildren = useMemo(() => {
    return (vendor.children || []).filter((child) => child && child.id !== vendor.id);
  }, [vendor.children, vendor.id]);

  // Calculate total fleet size including children
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
      <tr className={clsx(depth > 0 && "bg-gray-50")}>
        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
          <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
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

      {isExpanded &&
        memoizedChildren.map((child) => (
          <VendorNode key={child.id} vendor={child} depth={depth + 1} onAddSubVendor={onAddSubVendor} />
        ))}

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
