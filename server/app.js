import 'express-async-errors'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import {createServer} from 'http'
import connectDB from './config/connect'
import authRoutes from './routes/auth'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import errorHandlerMiddleware from './middleware/error-handler';
import notFound from './middleware/not-found';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()



const app = express()

app.use(express.json())


const httpServer = createServer(app);






app.get('/', (req,res)=>{
    res.send('Hello World')
})


const swaggerDocument = YAML.load(`${__dirname}./docs/swagger.yaml`);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// routes
app.use('/auth',authRouter);

// midelware 
app.use(cors());
app.use(notFound);
app.use(errorHandlerMiddleware);



// /start server 

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        const port = process.env.PORT || 3000;
        httpServer.listen(port, ()=>console.log(`listening on ${port}`))
    } catch (error) {
        console.log(error);
     }
}

start();


