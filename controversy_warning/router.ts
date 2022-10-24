/* eslint-disable operator-linebreak */
import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ControversyWarningCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as controversyWarningValidator from '../controversy_warning/middleware';
import * as util from './util';
import {Types} from 'mongoose';

const router = express.Router();

/**
 * Get all the controversy warnings
 *
 * @name GET /api/controversy-warnings
 *
 * @return {FreetResponse[]} - A list of all the controversyWarnings sorted in descending
 *                      order by date modified
 */
/**
 * Get controversyWarnings by freet id.
 *
 * @name GET /api/controversy-warnings?freetId=id
 *
 * @return {ControversyWarningResponse[]} - An array of controversyWarnings under a freet with with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    const allControversyWarnings = await ControversyWarningCollection.findAll();
    const response = allControversyWarnings.map(
      util.constructControversyWarningResponse
    );
    res.status(200).json(response);
  },
  [freetValidator.isFreetExistsInQuery],
  async (req: Request, res: Response) => {
    const {freetId} = req.query;

    const controversyWarning = await ControversyWarningCollection.findByFreetId(
      freetId as string
    );

    const response =
      util.constructControversyWarningResponse(controversyWarning);
    res.status(200).json(response);
  }
);

/**
 * Create a new ControversyWarning on a Freet.
 *
 * @name POST /api/controversy-warnings/:freetId
 *
 * @param {boolean} active -True if this warning should start out as active without needing to reach the threshold of user votes
 * @return {ControversyWarningResponse} - The created controversyWarning
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet count is empty or a stream of empty spaces
 * @throws {413} - If the freet count is more than 140 characters long
 */
router.post(
  '/:freetId',
  [
    freetValidator.isFreetExistsInParam,
    controversyWarningValidator.isFreetAlreadyHasControversyWarning
  ],
  async (req: Request, res: Response) => {
    const controversyWarning = await ControversyWarningCollection.addOne(
      req.params.freetId,
      0,
      [],
      req.body.active
    );

    res.status(201).json({
      message: 'Your controversyWarning was created successfully.',
      controversyWarning:
        util.constructControversyWarningResponse(controversyWarning)
    });
  }
);

/**
 * Update the ControversyWarning on a Freet.
 *
 * @name PUT /api/controversy-warnings/:freetId/
 *
 * @return {ControversyWarningResponse} - The created controversyWarning
 * @throws {403} - If the user has already voted once and is trying to vote again
 * @throws {400} - If the freet count is empty or a stream of empty spaces
 * @throws {413} - If the freet count is more than 140 characters long
 */
router.put(
  '/:freetId',
  [
    freetValidator.isFreetExistsInParam,
    userValidator.isUserLoggedIn,
    controversyWarningValidator.userHasVotedAlready
  ],
  async (req: Request, res: Response) => {
    const controversyWarning = await ControversyWarningCollection.addVote(
      req.params.freetId,
      req.session.userId
    );

    res.status(201).json({
      message: 'Your controversyWarning was updated successfully.',
      controversyWarning:
        util.constructControversyWarningResponse(controversyWarning)
    });
  }
);

export {router as controversyWarningRouter};
