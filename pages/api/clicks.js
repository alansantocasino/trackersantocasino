import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const { start, end } = req.query;
  console.log('Parámetros recibidos del frontend:', { start, end });

  // Obtenemos las fechas pasadas como parámetro, si no están presentes, tomamos la fecha actual
  const startDate = start ? new Date(start) : new Date();
  const endDate = end ? new Date(end) : new Date(startDate);

  // Convertimos las fechas a la zona horaria de Argentina (GMT-3)
  const argentinaOffset = -3 * 60; // Offset para GMT-3 en minutos

  // Ajustamos las fechas a la zona horaria de Argentina
  const startDateInArgentina = new Date(startDate);
  startDateInArgentina.setMinutes(startDateInArgentina.getMinutes() + argentinaOffset);

  const endDateInArgentina = new Date(endDate);
  endDateInArgentina.setMinutes(endDateInArgentina.getMinutes() + argentinaOffset);

  // Definimos el inicio y fin del día en la zona horaria de Argentina
  const startOfDay = new Date(startDateInArgentina.setHours(0, 0, 0, 0));
  const endOfDay = new Date(endDateInArgentina.setHours(23, 59, 59, 999));

  // Convertimos las fechas al formato ISO en UTC para asegurar que la base de datos pueda hacer la comparación correctamente
  const startOfDayISO = startOfDay.toISOString();
  const endOfDayISO = endOfDay.toISOString();

  // Realizamos la consulta a la base de datos filtrando por fecha
  const clicks = await Click.find({
    createdAt: {
      $gte: startOfDayISO,
      $lte: endOfDayISO
    }
  })
    .sort({ createdAt: -1 })
    .limit(500);

  res.json(clicks);
}