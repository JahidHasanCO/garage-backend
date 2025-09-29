import Manufacturer from "../models/manufacturer.model.js";
import Part from "../models/part.model.js";
import Vehicle from "../models/vehicle.model.js";
import FuelType from "../models/fuel.type.models.js";
import Garage from "../models/garage.model.js";
import ServiceCatalog from "../models/service.catalog.model.js";
import ServicePackage from "../models/service.package.model.js";

// Get overall statistics
export const getOverallStatistics = async (req, res) => {
  try {
    const [
      totalManufacturers,
      totalParts,
      totalVehicles,
      totalFuelTypes,
      totalGarages,
      totalServices,
      totalServicePackages
    ] = await Promise.all([
      Manufacturer.countDocuments(),
      Part.countDocuments(),
      Vehicle.countDocuments(),
      FuelType.countDocuments(),
      Garage.countDocuments(),
      ServiceCatalog.countDocuments(),
      ServicePackage.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalManufacturers,
        totalParts,
        totalVehicles,
        totalFuelTypes,
        totalGarages,
        totalServices,
        totalServicePackages
      }
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message
    });
  }
};

// Get detailed statistics with additional insights
export const getDetailedStatistics = async (req, res) => {
  try {
    // Basic counts
    const [
      totalManufacturers,
      totalParts,
      totalVehicles,
      totalFuelTypes,
      totalGarages,
      totalServices,
      totalServicePackages
    ] = await Promise.all([
      Manufacturer.countDocuments(),
      Part.countDocuments(),
      Vehicle.countDocuments(),
      FuelType.countDocuments(),
      Garage.countDocuments(),
      ServiceCatalog.countDocuments(),
      ServicePackage.countDocuments()
    ]);

    // Additional insights
    const [
      vehiclesByFuelType,
      topManufacturers,
      averageServicePrice
    ] = await Promise.all([
      Vehicle.aggregate([
        {
          $lookup: {
            from: "fueltypes",
            localField: "fuel_type",
            foreignField: "_id",
            as: "fuelTypeInfo"
          }
        },
        {
          $group: {
            _id: "$fuel_type",
            count: { $sum: 1 },
            fuelType: { $first: { $arrayElemAt: ["$fuelTypeInfo.title", 0] } }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Vehicle.aggregate([
        {
          $lookup: {
            from: "manufacturers",
            localField: "manufacturer",
            foreignField: "_id",
            as: "manufacturerInfo"
          }
        },
        {
          $group: {
            _id: "$manufacturer",
            count: { $sum: 1 },
            manufacturer: { $first: { $arrayElemAt: ["$manufacturerInfo.name", 0] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      ServiceCatalog.aggregate([
        {
          $group: {
            _id: null,
            averagePrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        // Basic counts
        totals: {
          totalManufacturers,
          totalParts,
          totalVehicles,
          totalFuelTypes,
          totalGarages,
          totalServices,
          totalServicePackages
        },
        // Additional insights
        insights: {
          vehiclesByFuelType,
          topManufacturers,
          servicesPricing: averageServicePrice[0] || {
            averagePrice: 0,
            minPrice: 0,
            maxPrice: 0
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching detailed statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch detailed statistics",
      error: error.message
    });
  }
};