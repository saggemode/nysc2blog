import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import db from '../../../utils/db';
import User from '../../../models/User';


async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { name, email,image, password } = req.body;

  if (
    !name ||
    !email ||
    !image ||
    !email.includes('@') ||
    (password && password.trim().length < 4)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
  const toUpdateUser = await User.findById(user._id);
  toUpdateUser.name = name;
  toUpdateUser.email = email;
  toUpdateUser.image = image;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();
  await db.disconnect();
  res.send({
    message: 'User updated',
  });
}

export default handler;