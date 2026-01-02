import type { MatchEvent } from "./match-events"

/**
 * A type representing a round in the match,
 * with appropriate match events.
 */
export type Round = {
    roundNumber: number
    startTime: Date
    /**
     * EndTime is nullable, as the round might still be ongoing,
     * whilst collection events.
     */
    endTime?: Date
    roundScore?: { ct: number, t: number }
    events: Array<MatchEvent>
}