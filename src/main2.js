import connectToMongoDB from "./config/configMongoDB.config.js";
import express, { request, response } from "express";
import { authRouter } from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import handlebars from "express-handlebars";
import ENVIRONMENT from "./config/environment.config.js";
import mailTransporter from "./config/mailTransporter.config.js";
import cors from 'cors'


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

/* mailTransporter.sendMail(
    {
        from: ENVIRONMENT.GMAIL_USER,
        to: 'aghusss@gmail.com',
        subject: 'probanding',
        html: `<body>
    <h1>ajsdjasdjadsjjdas</h1>
    <h2>buenonbueno</h2>
    <div><div><div><a href="https://media.istockphoto.com/id/1985150440/photo/new-zealand-road-trip-at-lake-hawea.jpg?s=1024x1024&w=is&k=20&c=cjX2olN9U6ypP1wv2EVjv6thjkPrERg8RLKhHn-KDO4=">mismafoto</a></div></div></div>
    <img src="https://media.istockphoto.com/id/1985150440/photo/new-zealand-road-trip-at-lake-hawea.jpg?s=1024x1024&w=is&k=20&c=cjX2olN9U6ypP1wv2EVjv6thjkPrERg8RLKhHn-KDO4=" alt="">
</body>
`
    }
)
 */
app.get("/", (req, res) => res.send(" API corriendo correctamente"));

if (process.env.NODE_ENV !== "production") {
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(` Server corriendo en puerto ${PORT}`));
}
/* app.listen(PORT, () => { console.log(`ON in ${PORT}`) }) */


// las capas basicas van a ser services routes repository middlewares controllers
export default app