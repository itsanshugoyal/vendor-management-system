// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  TruckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import useVendorStore from "../store/vendorStore";
import useFleetStore from "../store/fleetStore";
import useDriverStore from "../store/driverStore";
import { format, isAfter, addDays } from "date-fns";
import VendorDetailsModal from "../components/VendorDetailsModal";
import ComplianceAlert from "../components/ComplianceAlert";

export default function Dashboard() {
  const vendors = useVendorStore((state) => state.vendors);
  const vehicles = useFleetStore((state) => state.vehicles);
  const drivers = useDriverStore((state) => state.drivers);
  const updateVendorStatus = useVendorStore((state) => state.updateVendorStatus);
  const [complianceIssues, setComplianceIssues] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);

  // Calculate statistics
  const activeVendors = vendors.filter((v) => v.status === "Active").length;
  const activeVehicles = vehicles.filter((v) => v.status === "Active").length;
  const activeDrivers = drivers.filter((d) => d.status === "Active").length;
  const completedTrips = vehicles.reduce((acc, v) => acc + (v.completedTrips || 0), 0);

  const stats = [
    { name: "Active Vendors", value: activeVendors, icon: BuildingOfficeIcon },
    { name: "Active Vehicles", value: activeVehicles, icon: TruckIcon },
    { name: "Active Drivers", value: activeDrivers, icon: UserGroupIcon },
    { name: "Completed Trips", value: completedTrips, icon: ChartBarIcon },
  ];

  // Check for compliance issues
  useEffect(() => {
    const issues = [];
    const today = new Date();
    const warningDays = 30; // days before expiry to show a warning

    // Check vehicle documents
    vehicles.forEach((vehicle) => {
      Object.entries(vehicle.documents).forEach(([docType, doc]) => {
        const expiryDate = new Date(doc.expiryDate);
        const warningDate = addDays(today, warningDays);

        if (!isAfter(expiryDate, today)) {
          issues.push({
            id: `vehicle-${vehicle.id}-${docType}`,
            title: `Expired ${docType.toUpperCase()} Document`,
            description: `Vehicle ${vehicle.registrationNumber} has an expired ${docType.toUpperCase()} document.`,
            severity: "high",
            vendorId: vehicle.vendorId,
          });
        } else if (!isAfter(expiryDate, warningDate)) {
          issues.push({
            id: `vehicle-${vehicle.id}-${docType}`,
            title: `${docType.toUpperCase()} Document Expiring Soon`,
            description: `Vehicle ${
              vehicle.registrationNumber
            }'s ${docType.toUpperCase()} document will expire on ${format(expiryDate, "PP")}.`,
            severity: "medium",
            vendorId: vehicle.vendorId,
          });
        }
      });
    });

    // Check driver documents
    drivers.forEach((driver) => {
      Object.entries(driver.documents).forEach(([docType, doc]) => {
        const expiryDate = new Date(doc.expiryDate);
        const warningDate = addDays(today, warningDays);

        if (!isAfter(expiryDate, today)) {
          issues.push({
            id: `driver-${driver.id}-${docType}`,
            title: `Expired Driver ${docType.toUpperCase()}`,
            description: `Driver ${driver.name}'s ${docType.toUpperCase()} has expired.`,
            severity: "high",
            vendorId: driver.vendorId,
          });
        } else if (!isAfter(expiryDate, warningDate)) {
          issues.push({
            id: `driver-${driver.id}-${docType}`,
            title: `Driver ${docType.toUpperCase()} Expiring Soon`,
            description: `Driver ${driver.name}'s ${docType.toUpperCase()} will expire on ${format(expiryDate, "PP")}.`,
            severity: "medium",
            vendorId: driver.vendorId,
          });
        }
      });
    });

    setComplianceIssues(issues);
  }, [vehicles, drivers]);

  const handleSuspendVendor = (vendorId) => {
    updateVendorStatus(vendorId, "Suspended");
    setShowVendorDetails(false);
  };

  const handleResumeVendor = (vendorId) => {
    updateVendorStatus(vendorId, "Active");
    setShowVendorDetails(false);
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  const getVendorComplianceStatus = (vendorId) => {
    const vendorIssues = complianceIssues.filter((issue) => issue.vendorId === vendorId);
    const hasHighSeverity = vendorIssues.some((issue) => issue.severity === "high");
    const hasMediumSeverity = vendorIssues.some((issue) => issue.severity === "medium");

    if (hasHighSeverity) return { status: "Critical", class: "bg-red-100 text-red-800" };
    if (hasMediumSeverity) return { status: "Warning", class: "bg-yellow-100 text-yellow-800" };
    return { status: "Compliant", class: "bg-green-100 text-green-800" };
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Super Vendor Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Complete overview of your vendor network, fleet status, and compliance.
        </p>
      </div>

      {/* Compliance Alerts */}
      {complianceIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Compliance Issues</h2>
          {complianceIssues.map((issue) => (
            <ComplianceAlert
              key={issue.id}
              title={issue.title}
              description={issue.description}
              severity={issue.severity}
              onResolve={() => {
                setComplianceIssues((prev) => prev.filter((i) => i.id !== issue.id));
              }}
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vendor Network Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Network Overview</h2>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Fleet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map((vendor) => {
                const vendorVehicles = vehicles.filter((v) => v.vendorId === vendor.id);
                const vendorDrivers = drivers.filter((d) => d.vendorId === vendor.id);
                const complianceStatus = getVendorComplianceStatus(vendor.id);

                return (
                  <tr key={vendor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vendor.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vendorVehicles.length} vehicles / {vendorDrivers.length} drivers
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${complianceStatus.class}`}
                      >
                        {complianceStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => handleViewDetails(vendor)}
                      >
                        View Details
                      </button>
                      {complianceStatus.status === "Critical" && vendor.status === "Active" && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleSuspendVendor(vendor.id)}
                        >
                          Suspend Operations
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Details Modal */}
      {showVendorDetails && selectedVendor && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => setShowVendorDetails(false)}
          onSuspend={handleSuspendVendor}
          onResume={handleResumeVendor}
        />
      )}
    </div>
  );
}
