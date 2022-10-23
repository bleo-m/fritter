/* eslint-disable @typescript-eslint/comma-dangle */
import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore Comments
 * stored in MongoDB, including adding, finding, updating, and deleting Comments.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Comment> is the output of the CommentModel() constructor,
 * and contains all the information in Comment. https://mongoosejs.com/docs/typescript.html
 */
class CommentCollection {
  /**
   * Add a Comment to the collection
   *
   * @param {string} authorId - The id of the author of the Comment
   * @param {string} freetId - The id of the freet the Comment is associated with
   * @param {string} content - The id of the content of the Comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created Comment
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const Comment = new CommentModel({
      authorId,
      freetId,
      dateCreated: date,
      content,
      dateModified: date,
    });
    await Comment.save(); // Saves Comment to MongoDB
    return Comment.populate('authorId');
  }

  /**
   * Find a Comment by CommentId
   *
   * @param {string} CommentId - The id of the Comment to find
   * @return {Promise<HydratedDocument<Comment>> | Promise<null> } - The Comment with the given CommentId, if any
   */
  static async findOne(
    CommentId: Types.ObjectId | string
  ): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: CommentId}).populate('authorId');
  }

  /**
   * Get all the Comments in the database
   *
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the Comments
   */
  static async findAll(): Promise<Array<HydratedDocument<Comment>>> {
    // Retrieves Comments and sorts them from most to least recent
    return CommentModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the Comments by given author
   *
   * @param {string} username - The username of author of the Comments
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the Comments
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Comment>>> {
    const author = await UserCollection.findOneByUsername(username);
    return CommentModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the Comments for a given Freet
   *
   * @param {string} username - The username of author of the Comments
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the Comments
   */
  static async findAllByFreetId(
    freet: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({freetId: freet}).populate('freetId');
  }

  /**
   * Update a Comment with the new content
   *
   * @param {string} CommentId - The id of the Comment to be updated
   * @param {string} content - The new content of the Comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly updated Comment
   */
  static async updateOne(
    CommentId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<Comment>> {
    const Comment = await CommentModel.findOne({_id: CommentId});
    Comment.content = content;
    Comment.dateModified = new Date();
    await Comment.save();
    return Comment.populate('authorId');
  }

  /**
   * Delete a Comment with given CommentId.
   *
   * @param {string} CommentId - The CommentId of Comment to delete
   * @return {Promise<Boolean>} - true if the Comment has been deleted, false otherwise
   */
  static async deleteOne(CommentId: Types.ObjectId | string): Promise<boolean> {
    const Comment = await CommentModel.deleteOne({_id: CommentId});
    return Comment !== null;
  }

  /**
   * Delete all the Comments by the given author
   *
   * @param {string} authorId - The id of author of Comments
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await CommentModel.deleteMany({authorId});
  }
}

export default CommentCollection;
