
import * as yup from 'yup'
import { Request, Response, NextFunction } from 'express'

export default {
    create: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const schema = yup.object().shape({
                name: yup.string()
                    .trim()
                    .required('Informe o nome do item do menu.')
                    .typeError('O nome do item do menu deve ser um texto.'),

                relatedId: yup.number()
                    .integer('O identificador do menu deve ser um número inteiro.')
                    .positive('O identificador do menu deve ser maior que zero.')
                    .optional()
                    .typeError('O identificador do menu deve ser um número.')
            })

            req.body = await schema.validate(req.body, {
                abortEarly: false,
                strict: true
            })

            return next()
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({
                    messages: error.errors
                })
            }

            return res.status(500).json({
                message: 'Não foi possível validar os dados do menu.'
            })
        }
    }
}
