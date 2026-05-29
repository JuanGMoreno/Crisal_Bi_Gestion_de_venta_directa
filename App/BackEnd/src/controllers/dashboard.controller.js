import { DashboardService } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/async-handler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await DashboardService.getDashboardSummary(req.user.id);
  return res.status(200).json(dashboard);
});
