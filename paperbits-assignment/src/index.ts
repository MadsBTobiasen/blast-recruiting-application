import { shiftAlphabet } from "./utils/alphabet-shifter";
import { createIndexMapping } from "./utils/index-mapping-utils";

/**
 * Create a source letter object, where the index of the letter is determined by the paper bits alphabet.
 * - Also derived from the hint found in the source code of the original paper bits website.
 */
const indexMapping = createIndexMapping("c", 26);
const shiftedAlphabet = shiftAlphabet(indexMapping);

/**
 * With the shifted alphabet, we can now create a mapping for each letter in the scrambled note,
 * by providing the letter and its new index in the shifted alphabet.
 */
const scrambledIndexes = [
  26,
  15,
  12,
  26,
  12,
  25,
  12,
  17,
  26,
  5,
  2,
  20,
  2,
  1,
  10,
  22,
  10,
  24,
  17,
  26,
  5,
  11,
  12,
  17,
  2,
  16
]

var decodedMessage = scrambledIndexes.map(value => {
  // 1 is subtracted to convert from 1-based index to 0-based index.
  return shiftedAlphabet[value - 1].letter
}).join('')

// Prints: crocobotchewedmymatchnotes
// Result: crocobot chewed my match notes
console.log(decodedMessage)

/**
 * 
 * It seems that through that upon discovering the amount to shift the alphabet by,
 * that we've performed a caeser cipher, and decrypted the message successfully.
 * 
 */