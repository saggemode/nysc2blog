
import db from '../../util/db';
import User from '../../models/User';


const handler = async (req, res) => {
  try {
    await db.connect();
    let users = await User.find({});
    users = JSON.parse(JSON.stringify(users));
    await db.disconnect();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export default handler;