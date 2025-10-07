import mongoose from "mongoose";

export const createBookingValidator = (req, res, next) => {
  const { customer_id, servicePackage, singleService, garage, vehicle, assignedStaff, payment, requestedAt, notes } = req.body;

  // If customer_id not provided and requester is not customer, require customer_id
  // (the route/controller will map req.user to customer when appropriate)

  if (!servicePackage && !singleService) {
    return res.status(400).json({ message: "Either servicePackage or singleService must be provided" });
  }

  if (!garage) return res.status(400).json({ message: "garage is required" });

  if (assignedStaff !== undefined && !mongoose.Types.ObjectId.isValid(assignedStaff)) {
    return res.status(400).json({ message: "assignedStaff must be a valid id" });
  }

  if (vehicle !== undefined && !mongoose.Types.ObjectId.isValid(vehicle)) {
    return res.status(400).json({ message: "vehicle must be a valid id" });
  }

  if (servicePackage !== undefined && singleService != "" && !mongoose.Types.ObjectId.isValid(servicePackage)) {
    return res.status(400).json({ message: "servicePackage must be a valid id" });
  }

  if (singleService !== undefined && servicePackage != "" && !mongoose.Types.ObjectId.isValid(singleService)) {
    return res.status(400).json({ message: "singleService must be a valid id" });
  }

  if (customer_id !== undefined && !mongoose.Types.ObjectId.isValid(customer_id)) {
    return res.status(400).json({ message: "customer_id must be a valid id" });
  }

  if (payment !== undefined) {
    if (typeof payment !== 'object' || payment === null) return res.status(400).json({ message: 'payment must be an object' });
    if (payment.amount === undefined || typeof payment.amount !== 'number') return res.status(400).json({ message: 'payment.amount is required and must be a number' });
  }

  next();
};

export const updateBookingValidator = (req, res, next) => {
  const { servicePackage, singleService, garage, vehicle, assignedStaff, status, payment, requestedAt, completedAt, notes } = req.body;

  if (assignedStaff !== undefined && !mongoose.Types.ObjectId.isValid(assignedStaff)) {
    return res.status(400).json({ message: "assignedStaff must be a valid id" });
  }

  if (servicePackage !== undefined && !mongoose.Types.ObjectId.isValid(servicePackage)) {
    return res.status(400).json({ message: "servicePackage must be a valid id" });
  }

  if (singleService !== undefined && !mongoose.Types.ObjectId.isValid(singleService)) {
    return res.status(400).json({ message: "singleService must be a valid id" });
  }

  if (vehicle !== undefined && !mongoose.Types.ObjectId.isValid(vehicle)) {
    return res.status(400).json({ message: "vehicle must be a valid id" });
  }

  if (payment !== undefined) {
    if (typeof payment !== 'object' || payment === null) return res.status(400).json({ message: 'payment must be an object' });
    if (payment.amount !== undefined && typeof payment.amount !== 'number') return res.status(400).json({ message: 'payment.amount must be a number' });
  }

  // status check
  if (status !== undefined && !["requested","assigned","in_progress","completed","paid","cancelled"].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  next();
};
