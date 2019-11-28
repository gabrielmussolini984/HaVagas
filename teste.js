
const vector = [{id: 1, nome: 'Oi'},{id: 2, nome: 'Doido'},{id: 3, nome: 'Firmeza'},{id: 4, nome: 'Falai'}];


const novoObjeto = vector.map(item => {
  return {
    ...item,
    categoria: 1
  }
})
//console.log(vector)
console.log(novoObjeto)