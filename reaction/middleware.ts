import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactionCollection from '../reaction/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if ReactionId exists
 */
const isValidReactionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {reactionId} = req.params;
  const reaction = await ReactionCollection.findOne(reactionId);
  if (!reaction) {
    res.status(404).json({
      error:
        'ReactionId is not recognized or does not exist as part of any freet'
    });
    return;
  }

  next();
};

export {isValidReactionId};
