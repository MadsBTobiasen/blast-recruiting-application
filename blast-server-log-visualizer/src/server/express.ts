import express from "express"
import bodyParser from "body-parser"

import provisionRoutes from "./routes/provision-routes.ts"
import playersRoutes from "./routes/players-routes.ts"
import roundsRoutes from "./routes/rounds-routes.ts"

const app = express()
const port = 3000
    
app.use(bodyParser.json())

app.use("/api", provisionRoutes)
app.use("/api", playersRoutes)
app.use("/api", roundsRoutes)

app.listen(port, () => {
    console.log("Express server is running on port " + port)
})
