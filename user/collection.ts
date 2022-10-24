/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/comma-dangle */
import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(
    username: string,
    password: string
  ): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    const followers: string[] = [];
    const following: string[] = [];

    const user = new UserModel({
      username,
      password,
      dateJoined,
      followers,
      following
    });
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username.
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(
    username: string,
    caseSensitive = true
  ): Promise<HydratedDocument<User>> {
    const cleanedUpUser = caseSensitive
      ? new RegExp(`^${username.trim()}$`)
      : new RegExp(`^${username.trim()}$`, 'i');
    return UserModel.findOne({
      username: cleanedUpUser
    });
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(
    userId: Types.ObjectId | string,
    userDetails: any
  ): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }

  /**
   * Add to a user's follower's / following list
   *
   * @param {string} userId - The objectId of the user following another user
   * @param {string} followeeId - The objectId of the user getting a follower added
   * @returns {Promise<HydratedDocument<User>>} - The updated user
   */
  static async addFollower(
    userId: Types.ObjectId | string,
    followeeName: string
  ): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const followee = await UserCollection.findOneByUsername(followeeName);

    if (!user.following.includes(followeeName)) {
      // Add the followee's username to the user's following list
      user.following = [...user.following, followeeName];

      // Add the user's username to the followee's followers list
      followee.followers = [...followee.followers, user.username];
    }

    await user.save();
    return user;
  }

  /**
   * Remove from a user's followers / following list
   *
   * @param {string} userId - The objectId of the user following another user
   * @param {string} followeeId - The objectId of the user getting a follower added
   * @returns {Promise<HydratedDocument<User>>} - The updated user
   */
  static async removeFollower(
    userId: Types.ObjectId | string,
    followeeName: string
  ): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    const followee = await UserModel.findOne({username: followeeName});

    if (user.following.includes(followeeName)) {
      // Remove the followee's username from the user's following list
      user.following = user.following.filter((name) => name !== followeeName);

      // Remove the user's username from the followee's followers list
      followee.following = followee.following.filter(
        (name) => name !== user.username
      );
    }

    await user.save();
    return user;
  }
}

export default UserCollection;
