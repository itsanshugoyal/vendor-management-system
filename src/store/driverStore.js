import { create } from "zustand";
import { isAfter } from "date-fns";

const useDriverStore = create((set, get) => ({
  // Initial list of drivers
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

  // Add a new driver
  addDriver: (driverData) => {
    const newDriver = {
      id: Date.now(), // Unique ID
      ...driverData,
      status: "Active",
    };
    set((state) => ({ drivers: [...state.drivers, newDriver] }));
  },

  // Update driver's document details and validity status
  updateDriverDocuments: (driverId, documentType, documentData) => {
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              documents: {
                ...driver.documents,
                [documentType]: {
                  ...documentData,
                  status: isAfter(new Date(documentData.expiryDate), new Date()) ? "Valid" : "Expired",
                },
              },
            }
          : driver
      ),
    }));
  },

  // Assign a vehicle to a driver
  assignVehicle: (driverId, vehicleId) => {
    set((state) => ({
      drivers: state.drivers.map((driver) => (driver.id === driverId ? { ...driver, vehicleId } : driver)),
    }));
  },

  // Retrieve all drivers associated with a specific vendor
  getDriversByVendor: (vendorId) => {
    return get().drivers.filter((driver) => driver.vendorId === vendorId);
  },
  // In your useDriverStore file
  updateDriver: (driverId, updatedData) => {
    set((state) => ({
      drivers: state.drivers.map((driver) => (driver.id === driverId ? { ...driver, ...updatedData } : driver)),
    }));
  },
}));

export default useDriverStore;
