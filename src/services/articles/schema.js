const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const ArticleSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    subHead: {
      type: String,
      required: true,
    },
    content: String,
    category: {
        name:String,
        img:String
      },
    author: {
      name:String,
      img:String
      
    },
    cover:String,
    
  },
  { timestamps: true }
)

ArticleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Article", ArticleSchema)
