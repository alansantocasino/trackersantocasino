import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const { start, end } = req.query;

  // Asegurarnos que hay fechas
  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end dates are required' });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // Ajustamos el rango exacto de fechas a comparar
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  // Usamos una agregación que convierte el campo createdAt a formato 'YYYY-MM-DD'
  const clicks = await Click.aggregate([
    {
      $addFields: {
        createdAtDateOnly: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        }
      }
    },
    {
      $match: {
        createdAtDateOnly: { $gte: startStr, $lte: endStr }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $limit: 500
    }
  ]);

  res.json(clicks);
}