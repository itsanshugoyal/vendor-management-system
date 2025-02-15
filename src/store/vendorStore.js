import { create } from "zustand";

const useVendorStore = create((set, get) => ({
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

  addVendor: (vendorData) => {
    const newVendor = {
      id: Date.now(),
      ...vendorData,
      children: [],
      activeFleet: 0,
      status: "Active",
    };
    set((state) => ({ vendors: [...state.vendors, newVendor] }));
  },

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

  updateVendorStatus: (vendorId, status) => {
    const updateVendorRecursive = (vendors) => {
      return vendors.map((vendor) => {
        if (vendor.id === vendorId) {
          // Update the vendor and all its children with the new status
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
