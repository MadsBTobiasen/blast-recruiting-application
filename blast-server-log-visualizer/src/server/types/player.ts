import type { PlayerMatchEvent } from "./match-events"

/**
 * A type representing a player, and the actions associated with them.
 */
export type Player = {
    name: string
    fullIdentifier: string
    /**
     * Store all events pertinent to the player
     */
    roundEvents: Record<number, Array<PlayerMatchEvent>>
}