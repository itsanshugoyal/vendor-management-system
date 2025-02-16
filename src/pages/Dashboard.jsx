import { useState, useEffect, useMemo } from "react";
import { ChartBarIcon, TruckIcon, UserGroupIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import useVendorStore from "../store/vendorStore";
import useFleetStore from "../store/fleetStore";
import useDriverStore from "../store/driverStore";
import { format, isAfter, addDays } from "date-fns";
import VendorDetailsModal from "../components/VendorDetailsModal";
import ComplianceAlert from "../components/ComplianceAlert";

export default function Dashboard() {
  // Retrieve data from stores
  const vendors = useVendorStore((state) => state.vendors) || [];
  const vehicles = useFleetStore((state) => state.vehicles) || [];
  const drivers = useDriverStore((state) => state.drivers) || [];
  const updateVendorStatus = useVendorStore((state) => state.updateVendorStatus);

  // Local state for compliance issues and vendor modal
  const [complianceIssues, setComplianceIssues] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);

  // Calculate dashboard statistics
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

  // Compute compliance issues using useEffect
  useEffect(() => {
    const issues = [];
    const today = new Date();
    const warningDays = 30;

    // Check vehicle documents
    vehicles.forEach((vehicle) => {
      if (!vehicle.documents) return;
      Object.entries(vehicle.documents).forEach(([docType, doc]) => {
        if (!doc.expiryDate) return;
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
      if (!driver.documents) return;
      Object.entries(driver.documents).forEach(([docType, doc]) => {
        if (!doc.expiryDate) return;
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

  // Helper function to resolve an issue (removes it from state)
  const resolveComplianceIssue = (issueId) => {
    setComplianceIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== issueId));
  };

  // Determine vendor compliance status based on related issues
  const getVendorComplianceStatus = (vendorId) => {
    const vendorIssues = complianceIssues.filter((issue) => issue.vendorId === vendorId);
    if (vendorIssues.some((issue) => issue.severity === "high"))
      return { status: "Critical", class: "bg-red-100 text-red-800" };
    if (vendorIssues.some((issue) => issue.severity === "medium"))
      return { status: "Warning", class: "bg-yellow-100 text-yellow-800" };
    return { status: "Compliant", class: "bg-green-100 text-green-800" };
  };

  // Handler for opening vendor details modal
  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Super Vendor Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Complete overview of your vendor network, fleet status, and compliance.
        </p>
      </div>

      {/* Statistics Cards Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-5 shadow rounded-lg flex items-center">
            <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            <div className="ml-5">
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Alerts Section */}
      {complianceIssues.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Compliance Issues</h2>
          {complianceIssues.map((issue) => (
            <ComplianceAlert
              key={issue.id}
              title={issue.title}
              description={issue.description}
              severity={issue.severity}
              onResolve={() => resolveComplianceIssue(issue.id)}
            />
          ))}
        </div>
      )}

      {/* Vendor Network Overview Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                        onClick={() => updateVendorStatus(vendor.id, "Suspended")}
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

      {/* Vendor Details Modal */}
      {showVendorDetails && selectedVendor && (
        <VendorDetailsModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onSuspend={(id) => {
            updateVendorStatus(id, "Suspended");
            setSelectedVendor(null);
          }}
          onResume={(id) => {
            updateVendorStatus(id, "Active");
            setSelectedVendor(null);
          }}
        />
      )}
    </div>
  );
}
