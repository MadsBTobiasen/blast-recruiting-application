import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import provisionRoutes from "./routes/provision-routes.ts"
import playersRoutes from "./routes/players-routes.ts"
import roundsRoutes from "./routes/rounds-routes.ts"

const app = express()
const port = 3000
    
app.use(bodyParser.json())
app.use(cors({
    // As this app is not to be deployed / released, simply allow all origins.
    origin: "*"
}))

app.use("/api", provisionRoutes)
app.use("/api", playersRoutes)
app.use("/api", roundsRoutes)

app.listen(port, () => {
    console.log("Express server is running on port " + port)
})
