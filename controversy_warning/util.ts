/* eslint-disable arrow-parens */
import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {
  ControversyWarning,
  PopulatedControversyWarning
} from '../controversy_warning/model';

type ControversyWarningResponse = {
  _id: string;
  freet: string;
  count: number;
  voters: string[];
  active: boolean;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw ControversyWarning object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<ControversyWarning>} controversyWarning - A controversyWarning
 * @returns {ControversyWarningResponse} - The controversyWarning object formatted for the frontend
 */
const constructControversyWarningResponse = (
  controversyWarning: HydratedDocument<ControversyWarning>
): ControversyWarningResponse => {
  const controversyWarningCopy: PopulatedControversyWarning = {
    ...controversyWarning.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...controversyWarningCopy,
    _id: controversyWarningCopy._id.toString(),
    freet: controversyWarningCopy.freetId._id.toString(),
    count: controversyWarningCopy.count,
    voters: controversyWarningCopy.voters.map((voter) =>
      voter.username.toString()
    ),
    active: controversyWarning.active,
    dateModified: formatDate(controversyWarning.dateModified)
  };
};

export {constructControversyWarningResponse};
