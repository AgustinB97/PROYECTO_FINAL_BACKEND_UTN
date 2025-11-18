import connectToMongoDB from "./config/configMongoDB.config.js";
import express, { request, response } from "express";
import { authRouter } from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import handlebars from "express-handlebars";
import ENVIRONMENT from "./config/environment.config.js";
import mailTransporter from "./config/mailTransporter.config.js";
import cors from 'cors'
import chatRouter from "./routes/chat.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";


connectToMongoDB();

const app = express();

//con cors haces tu api publica
app.use(cors())


app.use(express.json());


/* //CONFIGURACION DE HANDLEBARS
//el motor de plantillas de mi app es HandleBars
app.engine('handlebars', handlebars.engine())

//El motor de vistas es hanldebars
app.set('view engine', 'handlebars')

app.set('views', './views')
 */
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter)
app.get("/", (req, res) => res.send(" API corriendo correctamente"))
app.use("/api/chat", chatRouter)
app.use("/api/users", userRouter)
app.use("/api/chat", messageRoutes);

if (process.env.NODE_ENV !== "production") {
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(` Server corriendo en puerto ${PORT}`));
}
/* app.listen(PORT, () => { console.log(`ON in ${PORT}`) }) */


// las capas basicas van a ser services routes repository middlewares controllers
export default app