import dbConnect from '../../lib/db';
import Click from '../../models/Click';

export default async function handler(req, res) {
  await dbConnect();

  const clicks = await Click.find().sort({ createdAt: -1 }).limit(500);
  res.json(clicks);
}