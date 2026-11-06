
import express from 'express'
import Menu from '../controllers/menu'
import validation from '../validation/menu'

const routes = express.Router()

routes.post('/', validation.create, Menu.create)
routes.get('/', Menu.getAll)
routes.delete('/:id', Menu.delete)

export default routes
