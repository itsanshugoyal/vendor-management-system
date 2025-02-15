import { create } from "zustand";
import { format, isAfter } from "date-fns";

const useDriverStore = create((set, get) => ({
  drivers: [
    {
      id: 1,
      name: "John Doe",
      phone: "9876543210",
      vendorId: 3,
      vehicleId: 1,
      status: "Active",
      documents: {
        license: {
          number: "DL123456",
          expiryDate: "2025-03-15",
          status: "Valid",
        },
      },
    },
  ],

  addDriver: (driverData) => {
    const newDriver = {
      id: Date.now(),
      ...driverData,
      status: "Active",
    };
    set((state) => ({ drivers: [...state.drivers, newDriver] }));
  },

  updateDriverDocuments: (driverId, documentType, documentData) => {
    set((state) => ({
      drivers: state.drivers.map((driver) => {
        if (driver.id === driverId) {
          return {
            ...driver,
            documents: {
              ...driver.documents,
              [documentType]: {
                ...documentData,
                status: isAfter(new Date(documentData.expiryDate), new Date()) ? "Valid" : "Expired",
              },
            },
          };
        }
        return driver;
      }),
    }));
  },

  assignVehicle: (driverId, vehicleId) => {
    set((state) => ({
      drivers: state.drivers.map((driver) => {
        if (driver.id === driverId) {
          return { ...driver, vehicleId };
        }
        return driver;
      }),
    }));
  },

  getDriversByVendor: (vendorId) => {
    return get().drivers.filter((driver) => driver.vendorId === vendorId);
  },
}));

export default useDriverStore;
