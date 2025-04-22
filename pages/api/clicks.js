import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const { start, end } = req.query;

  const startDate = start ? new Date(start) : new Date();
  const endDate = end ? new Date(end) : new Date(startDate);

  const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

  const clicks = await Click.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  })
    .sort({ createdAt: -1 })
    .limit(500);

  res.json(clicks);
}