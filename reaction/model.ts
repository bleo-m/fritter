import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
export type emotion = 'happy' | 'sad' | 'angry' | 'confused' | 'shocked'; // All the possible options for reactions

/**
 * This file defines the properties stored in a Reaction
 */

// Type definition for Reaction on the backend
export type Reaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
  emotion: emotion;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedReaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  freetId: Freet;
  emotion: emotion;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reactions stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReactionSchema = new Schema<Reaction>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  emotion: {
    type: String
  },
  // The date the reaction was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the reaction was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
