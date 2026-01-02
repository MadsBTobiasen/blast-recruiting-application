import type { RoundScore } from "./round-score";

/**
 * A type representing the relationship between a player and their score in the specified round.
 */
export type Scoreboard = Record<number, Array<RoundScore & { name: string }>>