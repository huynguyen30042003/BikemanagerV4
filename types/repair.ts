export type repairOrderParams = {
  CustomerId?: string;
  Status?: string;
  Page?: number;
  PageSize?: number;
};
export type repairOrderRes = {
  id: string;
  customerId: string;
  customerVehicleId: string;
  repairCode: string;
  issueDescription: string;
  diagnosis: string;
  status: string;
  estimatedCost: number;
  totalCost: string;
  checkInAt: string;
  completedAt: string;
};
