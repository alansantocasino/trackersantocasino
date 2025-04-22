import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const { start, end } = req.query;

  if (!start) {
    return res.status(400).json({ error: 'Start date is required' });
  }

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date(start); // Si no hay end, usamos start como fin también

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