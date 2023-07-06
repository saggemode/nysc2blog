
import Category from '../../models/Category';
import data from '../../util/data';

import db from '../../util/db';

const handler = async (req, res) => {
  await db.connect();
  await Category.deleteMany();
  await Category.insertMany(data.categories);

  await db.disconnect();
  res.send({ message: 'seeded successfully' });
};
export default handler;