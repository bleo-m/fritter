/* eslint-disable @typescript-eslint/no-unsafe-call */
import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from '../comment/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a Comment with CommentId in req.params exists
 */
const isCommentExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validFormat = Types.ObjectId.isValid(req.params.CommentId);
  const Comment = validFormat
    ? await CommentCollection.findOne(req.params.CommentId)
    : '';
  if (!Comment) {
    res.status(404).json({
      error: {
        CommentNotFound: `Comment with Comment ID ${req.params.CommentId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the Comment in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidCommentContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Comment content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Comment content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

export {isCommentExists, isValidCommentContent};
