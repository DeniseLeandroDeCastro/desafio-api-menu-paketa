import { model, Schema } from 'mongoose'

interface ICounter {
    _id: string
    sequence: number
}

const schema = new Schema<ICounter>({
    _id: { type: String, required: true },
    sequence: { type: Number, required: true, default: 0 }
})

export default model<ICounter>('counter', schema, 'counters')

