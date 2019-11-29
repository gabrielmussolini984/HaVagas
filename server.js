// Import's
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');
const sqlite = require('sqlite');
const admin = require('./routes/admin');
// Init App
const app = express();

// Connect DB
const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), {Promise});

// HandleBars Config
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
// BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Public
  //app.use(express.static('public'))
  app.use(express.static(path.join(__dirname,'public')));

// Routes

app.get('/', async (req, res)=>{
  const db = await dbConnection;
  const categoriasDB = await db.all('select * FROM categorias;');
  const vagas = await db.all('select * FROM vagas;');
  const categorias = categoriasDB.map(item => {
    return {
      ...item,
      vagas: vagas.filter(vaga => vaga.categoria === item.id)
    }
  })
  res.render('index', {categorias});
});

app.get('/vaga/:id', async (req, res)=>{
  const db = await dbConnection;
  const vaga = await db.get(`select * from vagas where id = ${req.params.id}`);
  res.render('vaga', {vaga});
});



app.use('/admin', admin);
const init = async () => {
  const db = await dbConnection;
  await db.run('create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT);');
  await db.run('create table if not exists vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT);');
  //const vaga = 'Designer Junior';
  //const descricao = 'Vaga para Designer Junior, que tenha muita vontade de aprender, que esteja cursando algum curso superior na area de tecnologia.'
  //await db.run(`insert into vagas (categoria, titulo, descricao) values (2, '${vaga}', '${descricao}')`)
  //const categoria = 'Time de Engenharia'
  //await db.run(`insert into categorias (categoria) values('${categoria}')`);
}
init();
// Server Running
const port = process.env.PORT || 3000;
app.listen(port, (err)=>{
  if (err) console.log('Error');
  console.log('Server is online in port 3000');
});




