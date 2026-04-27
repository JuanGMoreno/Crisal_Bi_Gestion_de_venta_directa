import { DashboardService } from '../services/dashboard.service.js';

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await DashboardService.getDashboardSummary(req.user.id);
    return res.status(200).json(dashboard);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el panel de control',
      error: error.message
    });
  }
};
