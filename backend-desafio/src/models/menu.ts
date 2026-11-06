import { model, Schema } from 'mongoose'

interface IMenu {
    id: number
    name: string
    relatedId?: number
}

const schema = new Schema<IMenu>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    relatedId: { type: Number, required: false }
})

export default model<IMenu>('menu', schema, 'menus')
