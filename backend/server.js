import app from './src/app.js'
import { configDotenv } from 'dotenv'

configDotenv()


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})