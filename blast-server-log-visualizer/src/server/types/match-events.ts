import type { EventType, PlayerEventType } from "./event-types"
import type { Vector3d } from "./vector"

export type MatchEvent<TEventType extends EventType = EventType> = {
    timestamp: Date
    type: TEventType
    message: string
}

/**
 * Type to reflect an action performed by a player.
 */
export type PlayerMatchEvent = {
    name: string
    /**
     * Indicate what happened to the player of the event.
     */
    playerEvent: PlayerEventType
    location: Vector3d
} & MatchEvent<'player'>