const express = require('express'); 
const router = express.Router();
const sqlite = require('sqlite');

const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), {Promise});
// Routes Admin
router.get('/', (req, res)=>{
  res.render('admin/home');
});



// CATEGORIAS
  // Menu Categorias
  router.get('/categorias', async (req, res)=>{
    const db = await dbConnection;
    const categorias = await db.all('select * from categorias;');
    res.render('admin/categorias', {categorias});
  });

  // Nova Categoria
    // Pagina do Formulario
    router.get('/categorias/nova', async (req,res)=>{
      res.render('admin/nova-categoria');
    });
    // Metodo POST
    router.post('/categorias/nova', async (req,res)=>{
      const db = await dbConnection;
      const { categoria } = req.body;
      await db.run(`insert into categorias (categoria) values ('${categoria}');`)
      res.redirect('/admin/categorias');
    });
  
  // Editar Categoria (Formulario)
  router.get('/categorias/editar/:id', async (req,res)=>{
    const db = await dbConnection;
    const categoria = await db.get('select * from categorias where id = '+ req.params.id+';');
    console.log(categoria)
    res.render('admin/editar-categoria', {categoria});
  });
  // Metodo Post
  router.post('/categorias/editar/:id', async (req,res)=>{
    const db = await dbConnection;
    const { categoria } = req.body;
    const { id } = req.params;
    await db.run(`update categorias set categoria = '${categoria}' where id = ${id};`);
    res.redirect('/admin/categorias');
  });



// VAGAS
  // Menu Vagas
  router.get('/vagas', async (req, res)=>{
    const db = await dbConnection;
    const vagas = await db.all('select * from vagas;');
    res.render('admin/vagas', {vagas});
  });

  // Deletar Vaga (Não Utilizado no Front)
  router.get('/vagas/delete/:id', async (req, res)=>{
    const db= await dbConnection;
    await db.run('delete from vagas where id = '+req.params.id+';');
    res.redirect('/admin/vagas');
  });

  // Nova Vaga
    // Pagina do Formulario
    router.get('/vagas/nova', async (req,res)=>{
      const db = await dbConnection;
      const categorias = await db.all('select * from categorias;');
      res.render('admin/nova-vaga', {categorias});
    });
    // Metodo POST
    router.post('/vagas/nova', async (req,res)=>{
      const db = await dbConnection;
      const { titulo, descricao, categoria } = req.body;
      //const titulo = req.body.titulo;
      //const descricao = req.body.descricao;
      //const categoria = req.body.categoria;
      await db.run(`insert into vagas (categoria, titulo, descricao) values ('${categoria}', '${titulo}', '${descricao}');`)
      res.redirect('/admin/vagas');
      //res.json(req.body.titulo)
    });

  // Editar Vaga (Formulario)
  router.get('/vagas/editar/:id', async (req,res)=>{
    console.log('Veio aqui');
    const db = await dbConnection;
    const categorias = await db.all('select * from categorias;');
    let selectFilter = [];
    const vaga = await db.get('select * from vagas where id = '+ req.params.id+';');
    categorias.forEach(cat =>{
      if (cat.id != vaga.categoria ){
        selectFilter.push({
          id: cat.id,
          categoria: cat.categoria,
          selected: false
        });  
      }else{
        selectFilter.push({
          id: cat.id,
          categoria: cat.categoria,
          selected: true
        }); 
      }
    });
    res.render('admin/editar-vaga', {selectFilter,vaga});
  });
  // Metodo Post
  router.post('/vagas/editar/:id', async (req,res)=>{
    const db = await dbConnection;
    const { titulo, descricao, categoria } = req.body;
    const { id } = req.params;
    await db.run(`update vagas set categoria = '${categoria}', titulo = '${titulo}', descricao = '${descricao}' where id = ${id};`);
    res.redirect('/admin/vagas');
    //res.json(req.body.titulo)
  });












module.exports = router;