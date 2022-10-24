import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as freetValidator from '../freet/middleware';
import * as reactionValidator from '../reaction/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all reactions
 *
 * @name GET /api/reactions
 *
 * @return {ReactionResponse[]} - An array of reactions
 * @throws {400} - If request is formatted incorrectly
 *
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const allReactions = await ReactionCollection.findAll();
  const response = allReactions.map(util.constructReactionResponse);
  res.status(200).json(response);
});

/**
 * Get reactions by freet id.
 *
 * @name GET /api/reactions?freetId=id
 *
 * @return {ReactionResponse[]} - An array of reactions under a freet with with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  [freetValidator.isFreetExistsInQuery],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.freetId !== undefined) {
      res.status(400).json({
        error: {
          ReactionNotFound: 'No Freet Id provided'
        }
      });
      return;
    }

    const {freetId} = req.query;

    const allReactions = await ReactionCollection.findAllByFreetId(
      freetId as string
    );
    const response = allReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Reaction on a Freet.
 *
 * @name POST /api/reactions/:freetId
 *
 * @param {string} content - The content of the reaction
 * @return {ReactionResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/:freetId',
  [freetValidator.isFreetExistsInParam],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    console.log(req.body.content);
    const reaction = await ReactionCollection.addOne(
      userId,
      req.params.freetId,
      req.body.content
    );

    res.status(201).json({
      message: 'Your reaction was created successfully.',
      reaction: util.constructReactionResponse(reaction)
    });
  }
);

export {router as reactionRouter};
