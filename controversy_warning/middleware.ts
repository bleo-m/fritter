import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import ControversyWarningCollection from '../controversy_warning/collection';
import ControversyWarningModel from './model';

/**
 * Checks if controversyWarningId exists
 */
const isValidControversyWarningId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {controversyWarningId} = req.params;
  const controversyWarning = await ControversyWarningCollection.findOne(
    controversyWarningId
  );
  if (!controversyWarning) {
    res.status(404).json({
      error:
        'controversyWarningId is not recognized or does not exist as part of any freet'
    });
    return;
  }

  next();
};

/**
 * Checks if controversyWarningId exists
 */
const isFreetAlreadyHasControversyWarning = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {freetId} = req.params;
  const controversyWarning = await ControversyWarningCollection.findByFreetId(
    freetId
  );
  if (controversyWarning) {
    res.status(403).json({
      error:
        'The Freet with the provided freetId already has an existing Controversy Warning asaociated with it.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user has already voted on an existing controversy warning
 */
const userHasVotedAlready = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {freetId} = req.params;
  const freet = await FreetCollection.findOne(freetId);
  const controversyWarning = await ControversyWarningModel.findOne({
    freetId: freet._id
  });
  if (controversyWarning.voters.includes(req.session.userId)) {
    res.status(403).json({
      error:
        'This userId is not allowed to flag a freet as controversial more than one time'
    });
    return;
  }

  next();
};

export {
  isValidControversyWarningId,
  userHasVotedAlready,
  isFreetAlreadyHasControversyWarning
};
