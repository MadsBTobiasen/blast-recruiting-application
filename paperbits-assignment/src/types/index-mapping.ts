import { Letter } from "../constants/alphabet"

/**
 * Provide a type to form the basis of our index mapping objects.
 */
export type IndexMapping = {
    letter: Letter;
    alphabetIndex: number;
    scrambledIndex: number;
}