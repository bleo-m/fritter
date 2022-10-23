/* eslint-disable @typescript-eslint/comma-dangle */
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  followers: string[];
  following: string[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // This user's username
  username: {
    type: String,
    required: true,
  },
  // This user's password
  password: {
    type: String,
    required: true,
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true,
  },
  // This user's followers
  followers: {
    type: [String],
    required: true,
  },
  // Other users that this user follows
  following: {
    type: [String],
    required: true,
  },
});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
