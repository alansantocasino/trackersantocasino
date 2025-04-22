import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const { start, end } = req.query;
  const filter = {};
  if (start || end) {
    filter.createdAt = {};
    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0); // inicio del día
      filter.createdAt.$gte = startDate;
    }
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
  }

  const clicks = await Click.find(filter).sort({ createdAt: -1 }).limit(500);
  res.json(clicks);
}