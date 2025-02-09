"use server";
import { CreateUserParams } from "@/types";
import { handleError } from "../utils";
import connectToDB from "../database";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";

export const createUser = async (user: CreateUserParams) => {
  try {
    await connectToDB();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (clerkId: string, user: CreateUserParams) => {
  try {
    await connectToDB();
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) {
      throw new Error("User update failed");
    }

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};
export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDB();
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      //   Order.updateMany(
      //     { _id: { $in: userToDelete.orders } },
      //     { $unset: { buyer: 1 } }
      //   ),
    ]);

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
};
