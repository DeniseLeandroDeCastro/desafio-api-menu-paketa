
import { Request, Response } from 'express'
import Menu from '../models/menu'
import Counter from '../models/counter'

export default {
    create: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, relatedId } = req.body

            if (relatedId !== undefined) {
                const parent = await Menu.findOne({ id: relatedId })

                if (!parent) {
                    return res.status(400).json({
                        message: 'O item do menu ao qual você está tentando adicionar este subitem não foi encontrado.'
                    })
                }
            }

            const counter = await Counter.findOneAndUpdate(
                { _id: 'menu' },
                { $inc: { sequence: 1 } },
                { new: true, upsert: true }
            )

            const menu = await Menu.create({
                id: counter.sequence,
                name,
                relatedId
            })

            return res.status(201).json({
                id: String(menu.id)
            })

        } catch (error) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 11000 &&
                'keyPattern' in error &&
                typeof error.keyPattern === 'object' &&
                error.keyPattern !== null &&
                'name' in error.keyPattern
            ) {
                return res.status(409).json({
                    message: 'Já existe um item do menu cadastrado com esse nome.'
                })
            }

            console.error('Error creating menu item:', error)

            return res.status(500).json({
                message: 'Não foi possível cadastrar o item do menu.'
            })
        }
    },

    getAll: async (req: Request, res: Response): Promise<Response> => {
        try {
            const items = await Menu.find().lean()

            const buildTree = (relatedId?: number): any[] => {
                return items
                    .filter(item => item.relatedId === relatedId)
                    .map(item => {
                        const submenus = buildTree(item.id)

                        return {
                            id: String(item.id),
                            name: item.name,
                            ...(submenus.length > 0 && { submenus })
                        }
                    })
            }

            const menu = buildTree()

            return res.status(200).json(menu)
        } catch (error) {
            console.error('Error fetching menu:', error)

            return res.status(500).json({
                message: 'Não foi possível consultar o menu.'
            })
        }
    },

    delete: async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = Number(req.params.id)
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: 'O identificador do item do menu é inválido.'
                })
            }

            const menu = await Menu.findOne({ id })
            if (!menu) {
                return res.status(404).json({
                    message: 'Item do menu não encontrado.'
                })
            }

            const ids = [id]
            for (let i = 0; i < ids.length; i++) {
                const children = await Menu.find({ relatedId: ids[i] })

                ids.push(...children.map(child => child.id))
            }

            await Menu.deleteMany({ id: { $in: ids } })

            return res.status(200).json({
                message: 'Item do menu e seus subitens excluídos com sucesso.'
            })
        } catch (error) {
            console.error('Error deleting menu item:', error)

            return res.status(500).json({
                message: 'Não foi possível excluir o item do menu.'
            })
        }
    }
}
