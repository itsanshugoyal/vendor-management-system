import { create } from "zustand";
import { isAfter } from "date-fns";

const useFleetStore = create((set, get) => ({
  vehicles: [
    {
      id: 1,
      registrationNumber: "KA01AB1234",
      model: "Toyota Innova",
      seatingCapacity: 7,
      fuelType: "Diesel",
      vendorId: 3,
      status: "Active",
      documents: {
        rc: {
          number: "RC123456",
          expiryDate: "2025-02-15",
          status: "Valid",
        },
        permit: {
          number: "P789012",
          expiryDate: "2024-12-31",
          status: "Valid",
        },
        pollution: {
          number: "PUC345678",
          expiryDate: "2024-06-30",
          status: "Valid",
        },
      },
    },
  ],

  // Add a new vehicle
  addVehicle: (vehicleData) => {
    const newVehicle = {
      id: Date.now(), // Unique ID using timestamp
      ...vehicleData,
      status: "Active",
    };
    set((state) => ({ vehicles: [...state.vehicles, newVehicle] }));
  },

  // Update a vehicle's details
  updateVehicle: (vehicleId, updatedData) => {
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...updatedData } : vehicle)),
    }));
  },

  // Update a specific document for a vehicle
  updateVehicleDocuments: (vehicleId, documentType, documentData) => {
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => {
        if (vehicle.id === vehicleId) {
          return {
            ...vehicle,
            documents: {
              ...vehicle.documents,
              [documentType]: {
                ...documentData,
                status: isAfter(new Date(documentData.expiryDate), new Date()) ? "Valid" : "Expired",
              },
            },
          };
        }
        return vehicle;
      }),
    }));
  },

  // Get vehicles associated with a specific vendor
  getVehiclesByVendor: (vendorId) => {
    return get().vehicles.filter((vehicle) => vehicle.vendorId === vendorId);
  },
}));

export default useFleetStore;
