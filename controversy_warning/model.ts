import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a ControversyWarning
 */

// Type definition for Reaction on the backend
export type ControversyWarning = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  count: number;
  voters: Types.ObjectId[];
  active: boolean;
  dateCreated: Date;
  dateModified: Date;
};

export type PopulatedControversyWarning = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  count: number;
  voters: User[];
  active: boolean;
  dateCreated: Date;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reactions stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ControversyWarningSchema = new Schema<ControversyWarning>({
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  count: {
    type: Number,
    required: true
  },
  voters: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  active: {
    type: Boolean,
    required: true
  },
  // The date the Controversy Warning was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the Controversy Warning was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const ControversyWarningModel = model<ControversyWarning>(
  'ControversyWarning',
  ControversyWarningSchema
);
export default ControversyWarningModel;
