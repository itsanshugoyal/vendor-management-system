import { create } from "zustand";

const useVendorStore = create((set, get) => ({
  // Initial vendor hierarchy
  vendors: [
    {
      id: 1,
      name: "National Fleet Services",
      type: "Super Vendor",
      region: "National",
      level: 1,
      activeFleet: 150,
      status: "Active",
      permissions: {
        fleetManagement: true,
        driverOnboarding: true,
        paymentProcessing: true,
        bookingManagement: true,
        subVendorManagement: true,
      },
      children: [
        {
          id: 2,
          name: "North Region Operations",
          type: "Regional Vendor",
          region: "North",
          level: 2,
          activeFleet: 45,
          status: "Active",
          permissions: {
            fleetManagement: true,
            driverOnboarding: true,
            paymentProcessing: false,
            bookingManagement: true,
            subVendorManagement: true,
          },
          children: [
            {
              id: 3,
              name: "Delhi City Cabs",
              type: "City Vendor",
              region: "Delhi",
              level: 3,
              activeFleet: 25,
              status: "Active",
              permissions: {
                fleetManagement: true,
                driverOnboarding: true,
                paymentProcessing: false,
                bookingManagement: true,
                subVendorManagement: false,
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],

  // Add a new top-level vendor
  addVendor: (vendorData) => {
    const newVendor = {
      id: Date.now(), // Unique ID
      ...vendorData,
      children: [],
      activeFleet: 0,
      status: "Active",
    };
    set((state) => ({ vendors: [...state.vendors, newVendor] }));
  },

  // Add a sub-vendor under a specified parent vendor
  addSubVendor: (parentId, vendorData) => {
    const addSubVendorRecursive = (vendors) => {
      return vendors.map((vendor) => {
        if (vendor.id === parentId) {
          return {
            ...vendor,
            children: [
              ...vendor.children,
              {
                id: Date.now(),
                ...vendorData,
                children: [],
                activeFleet: 0,
                status: "Active",
              },
            ],
          };
        }
        if (vendor.children) {
          return { ...vendor, children: addSubVendorRecursive(vendor.children) };
        }
        return vendor;
      });
    };

    set((state) => ({
      vendors: addSubVendorRecursive(state.vendors),
    }));
  },

  // Update permissions for a vendor
  updateVendorPermissions: (vendorId, permissions) => {
    const updateVendorRecursive = (vendors) => {
      return vendors.map((vendor) => {
        if (vendor.id === vendorId) {
          return { ...vendor, permissions: { ...vendor.permissions, ...permissions } };
        }
        if (vendor.children) {
          return { ...vendor, children: updateVendorRecursive(vendor.children) };
        }
        return vendor;
      });
    };

    set((state) => ({
      vendors: updateVendorRecursive(state.vendors),
    }));
  },

  // Update vendor status (Active/Inactive) and apply to all sub-vendors
  updateVendorStatus: (vendorId, status) => {
    const updateVendorRecursive = (vendors) => {
      return vendors.map((vendor) => {
        if (vendor.id === vendorId) {
          // Update the vendor and all its sub-vendors
          const updateChildren = (v) => ({
            ...v,
            status,
            children: v.children ? v.children.map(updateChildren) : [],
          });
          return updateChildren(vendor);
        }
        if (vendor.children) {
          return { ...vendor, children: updateVendorRecursive(vendor.children) };
        }
        return vendor;
      });
    };

    set((state) => ({
      vendors: updateVendorRecursive(state.vendors),
    }));
  },

  // Delegate permissions from a Super Vendor to another vendor
  delegateAuthority: (fromVendorId, toVendorId, permissions) => {
    const findVendor = (vendors, id) => {
      for (const vendor of vendors) {
        if (vendor.id === id) return vendor;
        if (vendor.children) {
          const found = findVendor(vendor.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const fromVendor = findVendor(get().vendors, fromVendorId);
    if (!fromVendor || fromVendor.type !== "Super Vendor") {
      throw new Error("Only Super Vendors can delegate authority");
    }

    get().updateVendorPermissions(toVendorId, permissions);
  },

  // Get the hierarchical path of a vendor
  getVendorHierarchy: (vendorId) => {
    const findVendorPath = (vendors, id, path = []) => {
      for (const vendor of vendors) {
        const newPath = [...path, vendor];
        if (vendor.id === id) return newPath;
        if (vendor.children) {
          const found = findVendorPath(vendor.children, id, newPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findVendorPath(get().vendors, vendorId);
  },

  // Get compliance status of a vendor
  getComplianceStatus: (vendorId) => {
    const vendor = get().vendors.find((v) => v.id === vendorId);
    if (!vendor) return null;

    return {
      documentStatus: "compliant",
      fleetStatus: "active",
      lastAudit: new Date().toISOString(),
      issues: [],
    };
  },
}));

export default useVendorStore;
