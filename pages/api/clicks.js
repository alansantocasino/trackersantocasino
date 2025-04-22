import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const { start, end } = req.query;

  // Traemos todos si hay rango de fechas
  const rawClicks = await Click.find({}).sort({ createdAt: -1 }).limit(1000); // límite alto para asegurar cobertura

  if (!start && !end) {
    return res.json(rawClicks);
  }

  // Filtrado por día exacto (ignorando hora)
  const startStr = start ? new Date(start).toISOString().split('T')[0] : null;
  const endStr = end ? new Date(end).toISOString().split('T')[0] : null;

  const filteredClicks = rawClicks.filter(c => {
    const clickDate = new Date(c.createdAt).toISOString().split('T')[0];
    if (startStr && clickDate < startStr) return false;
    if (endStr && clickDate > endStr) return false;
    return true;
  });

  res.json(filteredClicks);
}