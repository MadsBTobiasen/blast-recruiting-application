import { alphabet } from "../constants/alphabet";
import { IndexMapping } from "../types/index-mapping";
import { createIndexMapping } from "./index-mapping-utils";

/**
 * A utility function capable of shifting an english alphabet, 
 * by providing a letter which has a new position in a scrambled alphabet.
 * @param mapping
 */
export const shiftAlphabet = (mapping: IndexMapping): Array<IndexMapping> => {
    const shiftedIndex = Math.abs(mapping.alphabetIndex - mapping.scrambledIndex)
    // As shifted index is 0-based, we need to convert it to a 1-based index for slicing.  
    const alphabetShift = Math.abs(alphabet.length - shiftedIndex + 1)

    // With the shifted index distance, we can create a shifted alphabet array.
    const shiftedAlphabet = [
        ...alphabet.slice(alphabetShift),
        ...alphabet.slice(0, alphabetShift),
    ]

    return shiftedAlphabet.map((letter, index) => {
        // To create an new alphabet with a 1-based index, we need to add 1 to the index.
        return createIndexMapping(letter, index + 1)
    })
}