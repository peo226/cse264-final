import * as adminRepository from "../repositories/adminRepository.js";

const parseReviewId = (id) => {
  const parsedId = Number(id);

  if (!id || Number.isNaN(parsedId)) {
    const error = new Error("Valid review id is required");
    error.status = 400;
    throw error;
  }

  return parsedId;
};

export const getAllUsers = async () => {
  return adminRepository.findAllUsers();
};

export const getAllReviews = async () => {
  return adminRepository.findAllReviews();
};

export const deleteReview = async (id) => {
  const deleted = await adminRepository.removeReview(parseReviewId(id));

  if (!deleted) {
    const error = new Error("Review not found");
    error.status = 404;
    throw error;
  }

  return deleted;
};