import * as adminService from "../services/adminService.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await adminService.getAllReviews();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await adminService.deleteReview(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export { getAllUsers, getAllReviews, deleteReview };