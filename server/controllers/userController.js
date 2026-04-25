import * as userService from "../services/userService.js";

const isOwnUser = (req, id) => req.user.id === id;

const getUser = async (req, res, next) => {
  try {
    if (!isOwnUser(req, req.params.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createOrSyncUser({
      id: req.user.id,
      email: req.user.email,
      username: req.body.username,
      role: req.body.role,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (!isOwnUser(req, req.params.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (!isOwnUser(req, req.params.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await userService.removeUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export { getUser, createUser, updateUser, deleteUser };
