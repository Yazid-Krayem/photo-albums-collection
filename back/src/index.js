// back/src/index.js
import app from './app'
import initializeDatabase from './db'

const start = async () => {
  const controller = await initializeDatabase()
  
  app.get('/', (req, res, next) => res.send("ok"));

  // CREATE
  app.get('/photos/add', async (req, res, next) => {
    const { name,amount,age} = req.query
    const result = await controller.addPhoto({name,amount,age})
    res.json({success:true, result})
  })

  // READ
  app.get('/photos/get/:id', async (req, res, next) => {
    const { id } = req.params
    const photo = await controller.getphoto(id)
    res.json({success:true, result:photo})
  })

  // DELETE
  app.get('/photos/delete/:id', async (req, res, next) => {
    const { id } = req.params
    const result = await controller.deletePhoto(id)
    res.json({success:true, result})
  })

  // UPDATE
  app.get('/Photos/update/:id', async (req, res, next) => {
    const { id } = req.params
    const { name,amount,age } = req.query
    const result = await controller.updatePhoto(id,{name,amount,age})
    res.json({success:true, result})
  })

  // LIST
  app.get('/photos/list', async (req, res, next) => {
    const { order } = req.query
    const photo = await controller.getAllphotos(order)
    res.json(photo)
  })

  app.listen(8080, () => console.log('server listening on port 8080'))
}

start()
