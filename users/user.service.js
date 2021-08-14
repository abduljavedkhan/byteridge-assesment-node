const config = require("config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const User = db.User;

module.exports = {
  auditAllUser,
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

// get id from token and check role
async function auditAllUser({ usertoken }) {
  const token = usertoken.split(" ");
  const decoded = jwt.verify(token[1], config.secret);
  const user = await User.findOne({ _id: decoded.sub });
  if (user["role"] === "Auditor") {
    return await User.find().select("-hash");
  }
}

// for updating logout time
// require only 2 params username and type as "logout" in login request
async function authenticate({ username, password, ip, type }) {
  const user = await User.findOne({ username });
  if (type === "logout") {
    const result = await User.updateOne(
      { username },
      { lastLogout: Date.now() }
    );
    if (result["nModified"] > 0) {
      return { message: "logout successfully", success: true };
    }
  } else {
    if (user && bcrypt.compareSync(password, user.hash)) {
      const result = await User.updateOne(
        { username },
        { lastLogin: Date.now(), clientIP: ip }
      );
      const { hash, ...userWithoutHash } = user.toObject();
      const token = jwt.sign({ sub: user.id }, config.secret);
      return {
        ...userWithoutHash,
        token,
      };
    }
  }
}

async function getAll() {
  return await User.find().select("-hash");
}

async function getById(id) {
  return await User.findById(id).select("-hash");
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);
  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}
