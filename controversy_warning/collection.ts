/* eslint-disable operator-linebreak */
/* eslint-disable max-params */
import type {HydratedDocument, Types} from 'mongoose';
import type {ControversyWarning} from './model';
import ControversyWarningModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore controversyWarnings
 * stored in MongoDB, including adding, finding, updating, and deleting controversyWarnings.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<ControversyWarning> is the output of the ControversyWarningModel() constructor,
 * and contains all the information in controversyWarning. https://mongoosejs.com/docs/typescript.html
 */
class ControversyWarningCollection {
  private static get CONTROVERSY_LIMIT() {
    return 3;
  }

  /**
   * Add a controversyWarning to the collection
   *
   * @param {string} freetId - The id of the freet the controversyWarning is associated with
   * @param {number} count - The number of votes for the controversyWarning
   * @param {Array<string>} voters - The userId of all the users who have voted for the freet as controversial
   * @param {boolean} active - If this post is marked as controversial or not
   * @return {Promise<HydratedDocument<ControversyWarning>>} - The newly created controversyWarning
   */
  static async addOne(
    freetId: Types.ObjectId | string,
    count: number,
    voters: Types.ObjectId[] | string[],
    active: boolean
  ): Promise<HydratedDocument<ControversyWarning>> {
    const date = new Date();
    const controversyWarning = new ControversyWarningModel({
      freetId,
      count,
      voters,
      active,
      dateCreated: date,
      dateModified: date
    });
    await controversyWarning.save(); // Saves controversyWarning to MongoDB
    return controversyWarning.populate('voters');
  }

  /**
   * Find a controversyWarning by controversyWarningId
   *
   * @param {string} controversyWarningId - The id of the controversyWarning to find
   * @return {Promise<HydratedDocument<ControversyWarning>> | Promise<null> } - The controversyWarning with the given controversyWarningId, if any
   */
  static async findOne(
    controversyWarningId: Types.ObjectId | string
  ): Promise<HydratedDocument<ControversyWarning>> {
    return ControversyWarningModel.findOne({
      _id: controversyWarningId
    }).populate('voters');
  }

  /**
   * Get all the controversyWarnings in the database
   *
   * @return {Promise<HydratedDocument<ControversyWarning>[]>} - An array of all of the controversyWarnings
   */
  static async findAll(): Promise<Array<HydratedDocument<ControversyWarning>>> {
    // Retrieves controversyWarnings and sorts them from most to least recent
    return ControversyWarningModel.find({})
      .sort({dateModified: -1})
      .populate('voters');
  }

  /**
   * Get the controversyWarning for a given Freet
   *
   * @param {string} freetId - The freetId of a freet
   * @return {Promise<HydratedDocument<ControversyWarning>[]>} - An array of all of the controversyWarnings
   */
  static async findByFreetId(
    freet: Types.ObjectId | string
  ): Promise<HydratedDocument<ControversyWarning>> {
    return ControversyWarningModel.findOne({freetId: freet}).populate('voters');
  }

  /**
   * Delete a controversyWarning with given controversyWarningId.
   *
   * @param {string} controversyWarningId - The controversyWarningId of controversyWarning to delete
   * @return {Promise<Boolean>} - true if the controversyWarning has been deleted, false otherwise
   */
  static async deleteOne(
    controversyWarningId: Types.ObjectId | string
  ): Promise<boolean> {
    const controversyWarning = await ControversyWarningModel.deleteOne({
      _id: controversyWarningId
    });
    return controversyWarning !== null;
  }

  /**
   * Delete a controversyWarning associated with the given freetId.
   *
   * @param {string} freetId - The controversyWarningId of controversyWarning to delete
   * @return {Promise<Boolean>} - true if the controversyWarning has been deleted, false otherwise
   */
  static async deleteOneByFreetId(
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const freet = await FreetCollection.findOne(freetId);
    const controversyWarning = await ControversyWarningModel.deleteOne({
      freetId: freet._id
    });
    return controversyWarning !== null;
  }

  static async addVote(
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<ControversyWarning>> {
    const freet = await FreetCollection.findOne(freetId);
    const newVoter = await UserCollection.findOneByUserId(userId);
    const controversyWarning = await ControversyWarningModel.findOne({
      freetId: freet._id
    });

    // Update controversy warning details
    controversyWarning.count += 1; // Increase count by one
    controversyWarning.voters = [...controversyWarning.voters, newVoter._id];
    if (!controversyWarning.active) {
      controversyWarning.active =
        controversyWarning.count >= this.CONTROVERSY_LIMIT;
    }

    controversyWarning.dateModified = new Date();
    await controversyWarning.save();
    return controversyWarning.populate('voters');
  }
}

export default ControversyWarningCollection;
