import express from "express"
import bodyParser from "body-parser"

import provisionRoutes from "./routes/provision-routes.ts"

const app = express()
const port = 3000
    
app.use(bodyParser.json())

app.use("/api", provisionRoutes)

app.listen(port, () => {
    console.log("Express server is running on port " + port)
})
