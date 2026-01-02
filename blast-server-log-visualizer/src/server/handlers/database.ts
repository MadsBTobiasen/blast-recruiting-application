import { existsSync } from "fs"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url";
import type { Round } from "../types/round";
import type { Player } from "../types/player";

/**
 * A function that provies common functionality for interracting with a data store.
 * @param fileName 
 * @param extension
 * @param handler Custom handler to parse data from saved format.
 * @param TData The type of data being stored
 * @returns 
 */
const useDatabase = <TData>(
    fileName: string,
    extension: "txt" | "json" = "json",
    handler?: (t: string) => TData
) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dbDirectory = path.join(__dirname, "..", "db")
    const dbFile = `${dbDirectory}/${fileName}.${extension}`

    /**
     * Fetch information from the database.
     * @returns 
     */
    const get = async (): Promise<TData | undefined> => {
        if (!existsSync(dbFile))
            return undefined

        const content = await readFile(dbFile, { encoding: "utf-8" })

        if (!content)
            return undefined
        
        // Handling json.
        if (extension === "json") {
            return handler
                ? handler(content)
                : JSON.parse(content) as TData
        }
        
        if (!handler)
            throw new Error("A handler must be provided for non-json data.")
        return handler(content)
    }

    /**
     * Save information to the database.
     * @param data 
     */
    const save = async (data: TData | string) => {
        await writeFile(dbFile, 
            typeof data === "string"
                ? data
                : JSON.stringify(data, null, 4),
            {
                encoding: "utf-8"
            }
        )
    }

    return {
        get,
        save
    }
}

export const matchDataDatabase = useDatabase<string[]>(
    "match-data", 
    "txt",
    (t) => t.split("\r\n")
)

export const roundDataDatabase = useDatabase<Array<Round>>(
    "round-data",
    "json"
)

export const playerDatabase = useDatabase<Record<string, Player>>(
    "player-data",
    "json"
)