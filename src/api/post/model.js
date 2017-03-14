import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String
  }
}, {
  timestamps: true
})

postSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Post', postSchema)

export const schema = model.schema
export default model
