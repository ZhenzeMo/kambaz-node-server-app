import model from "./model.js";

import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {

  let { users } = db;

  const createUser = (user) => {
    const { _id, ...userWithoutId } = user;
    const newUser = { ...userWithoutId, _id: uuidv4() };
    return model.create(newUser);
  };

  const findAllUsers = () => model.find().lean();

  const findUserById = (userId) => model.findById(userId).lean();

  const findUserByUsername = (username) =>  model.findOne({ username: username }).lean();

  const findUserByCredentials = (username, password) =>  model.findOne({ username, password }).lean();

  const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  const findUsersByRole = (role) => model.find({ role: role }).lean();

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    }).lean();
  };

  return { createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser, findUsersByRole, findUsersByPartialName };

}

