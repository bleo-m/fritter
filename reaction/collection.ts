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
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Reaction>>> {
    const freet = await FreetCollection.findOne(freetId);
    return ReactionModel.find({freetId: freet._id})
      .sort({emotion: 'asc'})
      .populate('authorId');
  }

  /**
   * Get a reaction from a user on a specific freet
   *
   * @param {string} freet - The freetId of a freet
   * @param {string} user - The userId of a user
   * @return {Promise<HydratedDocument<Reaction>>} - The reaction
   */
  static async findByFreetIdAndUserId(
    freetId: Types.ObjectId | string,
    user: Types.ObjectId
  ): Promise<HydratedDocument<Reaction>> {
    const freet = await FreetCollection.findOne(freetId);
    const reaction = await ReactionModel.find({
      freetId: freet._id
    })
      .findOne({authorId: user})
      .populate('authorId', 'fritterId');
    return reaction;
  }

  /**
   * Update a reaction with the new emotion
   *
   * @param {string} reactionId - The id of the reaction to be updated
   * @param {emotion} emotion - The new emotion of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly updated reaction
   */
  static async updateOne(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    emotion: emotion
  ): Promise<HydratedDocument<Reaction>> {
    const freet = await FreetCollection.findOne(freetId);
    const reaction = await ReactionModel.find({freetId: freet}).findOne({
      authorId: userId
    });
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
   * Delete a reaction with given reactionId.
   *
   * @param {string} reactionId - The reactionId of reaction to delete
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */
  static async deleteOneByFreetIdAndUserId(
    freet: Types.ObjectId | string,
    user: Types.ObjectId
  ): Promise<boolean> {
    const reaction = await ReactionCollection.findByFreetIdAndUserId(
      freet,
      user
    );
    const isDeleted = await ReactionModel.deleteOne({_id: reaction._id});
    return isDeleted !== null;
  }

  /**
   * Delete all the reactions by the given author
   *
   * @param {string} authorId - The id of author of reactions
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({authorId});
  }

  /**
   * Delete all the reactions by the given freetId
   *
   * @param {string} freetId - The id of the freet associated with the reactions
   */
  static async deleteManyByFreetId(
    freetId: Types.ObjectId | string
  ): Promise<void> {
    await ReactionModel.deleteMany({freetId});
  }
}

export default ReactionCollection;
