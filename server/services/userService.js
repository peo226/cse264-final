import * as userRepository from "../repositories/userRepository.js";

const validRoles = new Set(["user", "admin"]);

const normalizeRole = (role) => {
  if (role === undefined || role === null) {
    return undefined;
  }

  if (!validRoles.has(role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  return role;
};

export const getUserById = async (id) => {
  if (!id) {
    const error = new Error("User id is required");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

export const createOrSyncUser = async (data) => {
  const { id, email, username = null, role = "user" } = data;

  if (!id || !email) {
    const error = new Error("Missing required fields");
    error.status = 400;
    throw error;
  }

  return userRepository.upsert({
    id,
    email,
    username,
    role: normalizeRole(role) || "user",
  });
};

export const updateUser = async (id, updates) => {
  if (!id) {
    const error = new Error("User id is required");
    error.status = 400;
    throw error;
  }

  if (!updates.username) {
    const error = new Error("Missing required fields");
    error.status = 400;
    throw error;
  }

  const user = await userRepository.update(id, { username: updates.username });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

export const removeUser = async (id) => {
  if (!id) {
    const error = new Error("User id is required");
    error.status = 400;
    throw error;
  }

  const deletedUser = await userRepository.remove(id);
  if (!deletedUser) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return deletedUser;
};
