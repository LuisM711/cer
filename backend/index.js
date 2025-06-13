const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
//const cookieParser = require('cookie-parser');
//const path = require('path');
const dotenv = require('dotenv');
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: true,
  limit: '50mb',
  parameterLimit: 1000000

 }));
//const bodyParser = require('body-parser');
const sequelize = require('./database.js');
//const morgan = require('morgan');
//app.use(cookieParser());
//app.use(morgan('dev'));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  abortOnLimit: true,
  responseOnLimit: 'El archivo excede el tamaño máximo permitido de 50 MB'
}));
app.use(express.json());
//app use multer
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: `${process.env.SECRET}`,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false, sameSite: 'lax', maxAge: 60000000 },

}));
dotenv.config();
app.disable('x-powered-by');
sequelize.sync({ force: true }).then(() => {
  console.log('Base de datos conectada');
}).catch(error => {
  console.log('Error al conectar a la base de datos: ' + error.message);
});


// app.use('/documentos', express.static(path.join(__dirname, 'documentos')));

app.use('/', routes());
app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.BACKEND_PORT}`);
});