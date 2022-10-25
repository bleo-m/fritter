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

/**
 * Checks if the emotion for the reaction is valid
 */
const isValidEmotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validEmotions = new Set([
    'happy',
    'sad',
    'angry',
    'confused',
    'shocked'
  ]);
  const emotion = req.body.emotion as string;
  if (!validEmotions.has(emotion.toLowerCase())) {
    res.status(404).json({
      error:
        'Reaction emotion is not recognized as a valid emotion on the fritter platform'
    });
    return;
  }

  next();
};

const userHasNotReactedToFreet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const reaction = await ReactionCollection.findByFreetIdAndUserId(
    freet._id,
    req.session.userId
  );

  if (reaction) {
    res.status(403).json({
      error:
        'UserId already has a reaction associtated with this post. Use a PUT request to update it, or DELETE it before POSTing a new one.'
    });
    return;
  }

  next();
};

const userHasReactedToFreet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const reaction = await ReactionCollection.findByFreetIdAndUserId(
    freet._id,
    req.session.userId
  );
  if (!reaction) {
    res.status(403).json({
      error: 'UserId does not have a reaction associtated with this post.'
    });
    return;
  }

  next();
};

export {
  isValidEmotion,
  isValidReactionId,
  userHasNotReactedToFreet,
  userHasReactedToFreet
};
