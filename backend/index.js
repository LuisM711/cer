const fs = require('fs');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const express = require('express');
const https = require('https');
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${env}`)
});

const routes = require('./routes');
const sequelize = require('./database.js');

const app = express();


app.use(express.urlencoded({
  extended: true,
  limit: '50mb',
  parameterLimit: 1000000
}));

app.use(express.json());

app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: 'El archivo excede el tamaño máximo permitido de 50 MB'
}));



app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://proyectomedico.xyz:8001',
  credentials: true
}));


const sessConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60000000
  }
};
app.use(session(sessConfig));

// 4) DESHABILITAR HEADER
app.disable('x-powered-by');

// 5) RUTAS
app.use('/', routes());




// const qi = sequelize.getQueryInterface();

// // 1) Lista los índices de 'afiliaciones'
// (async () => {
//   const [results] = await sequelize.query(
//     "PRAGMA table_info('afiliaciones');"
//   );
//   console.table(results);
// })();





sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada y alterada para reflejar cambios en el modelo');
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la BD:', err);
    process.exit(1);
  });

if (process.env.NODE_ENV === 'development') {

  app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.BACKEND_PORT}`);
  });
}
else if (process.env.NODE_ENV === 'production') {
  console.log('Servidor en producción, iniciando HTTPS...');

  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/proyectomedico.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/proyectomedico.xyz/fullchain.pem')
  };


  const PORT = process.env.BACKEND_PORT || 8001;
  https.createServer(httpsOptions, app)
    .listen(PORT, () => {
      console.log(`Servidor HTTPS escuchando en puerto ${PORT}`);
    });
}