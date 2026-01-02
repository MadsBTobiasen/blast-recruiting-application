/**
 * The alphabet used by Paper Bits.
 * @remarks
 * Note; the type is defined as const, so we can construct types from it later.
 */
export const alphabet = [
  "a","b","c","d","e","f","g",
  "h","i","j","k","l","m",
  "n","o","p","q","r","s",
  "t","u","v","w","x","y","z"
] as const;
/**
 * A type representing a single letter of the alphabet.
 */
export type Letter = typeof alphabet[number]