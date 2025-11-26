import dotenv from 'dotenv'


dotenv.config()

const ENVIRONMENT = {
    GMAIL_PASSWORD : process.env.GMAIL_PASSWORD,
    GMAIL_USER : process.env.GMAIL_USER,
    APP_PASSWORD : process.env.APP_PASSWORD,
    URL_FRONTEND: process.env.URL_FRONTEND,
    JWT_SECRET : process.env.JWT_SECRET,
/*     ATLAS_MONGO_DB_NAME : process.env.ATLAS_MONGO_DB_NAME,
    ATLAS_MONGO_DB_PASSWORD: process.env.ATLAS_MONGO_DB_PASSWORD */
    MONGO_DB_CONNECTION_STRING : process.env.MONGO_DB_CONNECTION_STRING,
    BACKEND_URL : process.env.BACKEND_URL
}



export default ENVIRONMENT