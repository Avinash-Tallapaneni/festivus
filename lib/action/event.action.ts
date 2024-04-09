"use server";
import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from "@/types";
import connectToDB from "../database";
import { handleError } from "../utils";
import Category from "../database/models/category.model";
import User from "../database/models/user.model";
import Event from "../database/models/event.model";
import { revalidatePath } from "next/cache";

//Creating Event

export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDB();
    const organizer = await User.findById(userId);

    if (!organizer) {
      throw new Error("Organizer not found");
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};

const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({
      path: "category",
      model: Category,
      select: "_id name",
    });
};

//Get Event by eventId

export const getEventById = async (eventId: string) => {
  try {
    await connectToDB();

    const eventDetails = await populateEvent(Event.findById(eventId));

    if (!eventDetails) {
      throw new Error("Event not found");
    }

    return JSON.parse(JSON.stringify(eventDetails));
  } catch (error) {
    handleError(error);
  }
};

//Get All events

export const getAllEvents = async ({
  query,
  limit = 1,
  page,
  category,
}: GetAllEventParams) => {
  try {
    await connectToDB();

    const condition = {};

    const eventDetails = await populateEvent(
      Event.find(condition).sort({ createdAt: "desc" }).skip(0).limit(limit)
    );

    const eventCount = await Event.countDocuments(condition);

    if (!eventDetails) {
      throw new Error("Event not found");
    }

    return {
      data: JSON.parse(JSON.stringify(eventDetails)),
      totalPage: Math.ceil(eventCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// Delete Event

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDB();

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (deletedEvent) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};

// Update Event

export const updateEvent = async ({
  event,
  userId,
  path,
}: UpdateEventParams) => {
  try {
    await connectToDB();

    const eventToUpdate = await Event.findById(event._id);

    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
};

// get relavent Event by same category

export const getRelatedEventsByCategory = async ({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) => {
  try {
    await connectToDB();
    const skipAmount = (Number(page) - 1) * limit;
    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

// get event by user

export const getEventsByUser = async ({
  userId,
  limit = 6,
  page,
}: GetEventsByUserParams) => {
  try {
    await connectToDB();

    const conditions = { organizer: userId };
    // const skipAmount = (page - 1) * limit;

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      // .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};
