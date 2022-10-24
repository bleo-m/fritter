import type {HydratedDocument, Types} from 'mongoose';
import type {emotion, Reaction} from './model';
import ReactionModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore reactions
 * stored in MongoDB, including adding, finding, updating, and deleting reactions.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reaction> is the output of the ReactionModel() constructor,
 * and contains all the information in reaction. https://mongoosejs.com/docs/typescript.html
 */
class ReactionCollection {
  /**
   * Add a reaction to the collection
   *
   * @param {string} authorId - The id of the author of the reaction
   * @param {string} freetId - The id of the freet the reaction is associated with
   * @param {emotion} emotion - The emotion of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly created reaction
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    emotion: emotion
  ): Promise<HydratedDocument<Reaction>> {
    const date = new Date();
    const reaction = new ReactionModel({
      authorId,
      freetId,
      emotion,
      dateCreated: date,
      dateModified: date
    });
    await reaction.save(); // Saves reaction to MongoDB
    return reaction.populate('authorId');
  }

  /**
   * Find a reaction by reactionId
   *
   * @param {string} reactionId - The id of the reaction to find
   * @return {Promise<HydratedDocument<Reaction>> | Promise<null> } - The reaction with the given reactionId, if any
   */
  static async findOne(
    reactionId: Types.ObjectId | string
  ): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({_id: reactionId}).populate('authorId');
  }

  /**
   * Get all the reactions in the database
   *
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAll(): Promise<Array<HydratedDocument<Reaction>>> {
    // Retrieves reactions and sorts them from most to least recent
    return ReactionModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the reactions by given author
   *
   * @param {string} username - The username of author of the reactions
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Reaction>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReactionModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the reactions for a given Freet
   *
   * @param {string} freetId - The freetId of a freet
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAllByFreetId(
    freet: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({freetId: freet})
      .sort({emotion: 'asc'})
      .populate('freetId');
  }

  /**
   * Update a reaction with the new emotion
   *
   * @param {string} reactionId - The id of the reaction to be updated
   * @param {emotion} emotion - The new emotion of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly updated reaction
   */
  static async updateOne(
    reactionId: Types.ObjectId | string,
    emotion: emotion
  ): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({_id: reactionId});
    reaction.emotion = emotion;
    reaction.dateModified = new Date();
    await reaction.save();
    return reaction.populate('authorId');
  }

  /**
   * Delete a reaction with given reactionId.
   *
   * @param {string} reactionId - The reactionId of reaction to delete
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */
  static async deleteOne(
    reactionId: Types.ObjectId | string
  ): Promise<boolean> {
    const reaction = await ReactionModel.deleteOne({_id: reactionId});
    return reaction !== null;
  }

  /**
   * Delete all the reactions by the given author
   *
   * @param {string} authorId - The id of author of reactions
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({authorId});
  }
}

export default ReactionCollection;
