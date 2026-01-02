import { alphabet, Letter } from "../constants/alphabet";
import { IndexMapping } from "../types/index-mapping";

/**
 * Create an index mapping object for a given letter.
 * @param letter Letter as per the Paper Bits alphabet.
 * @param scrambledIndex Index of the letter in the scrambled alphabet.
 */
export const createIndexMapping = (letter: Letter, scrambledIndex: number): IndexMapping => {
    return {
        letter, 
        // Convert to 1-based index
        alphabetIndex: alphabet.indexOf(letter),
        scrambledIndex
    }
}