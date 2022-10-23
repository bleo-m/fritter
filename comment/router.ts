import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get comments by freet id.
 *
 * @name GET /api/comments?freetId=id
 *
 * @return {CommentResponse[]} - An array of comments under a freet with with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  // Check if authorId query parameter was supplied
  if (req.query.freetId !== undefined) {
    res.status(400).json({
      error: {
        CommentNotFound: 'No Freet Id provided'
      }
    });
    return;
  }

  const {freetId} = req.query;

  const allComments = await CommentCollection.findAllByFreetId(
    freetId as string
  );
  const response = allComments.map(util.constructCommentResponse);
  res.status(200).json(response);
});

/**
 * Create a new Comment on a Freet.
 *
 * @name POST /api/comment/:freetId
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post('/:freetId', async (req: Request, res: Response) => {
  const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
  const comment = await CommentCollection.addOne(
    userId,
    req.params.freetId,
    req.body.content
  );

  res.status(201).json({
    message: 'Your comment was created successfully.',
    comment: util.constructCommentResponse(comment)
  });
});

export {router as freetRouter};
