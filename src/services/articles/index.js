const express = require("express")

const ArticleSchema = require("./schema")

const articlesRoute = express.Router()

articlesRoute.get("/", async (req, res, next) => {
    try {
      const article = await ArticleSchema.find()
      res.send(article)
    } catch (error) {
      next(error)
    }
  })
  articlesRoute.get("/:id", async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await ArticleSchema.findById(id)
      if (user) {
        res.send(user)
      } else {
        const error = new Error()
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      console.log(error)
      next("opsssssy!")
    }
  })
  articlesRoute.post("/", async (req, res, next) => {
    try {
        console.log('here')
      const newArticle = new ArticleSchema(req.body)
      const { _id } = await newArticle.save()
  
      res.status(201).send(_id)
    } catch (error) {
        console.log(error)
      next(error)
    }
  })
  articlesRoute.put("/:id", async (req, res, next) => {
    try {
      const user = await ArticleSchema.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
      })
      if (user) {
        res.send(user)
      } else {
        const error = new Error(`User with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })
  
  articlesRoute.delete("/:id", async (req, res, next) => {
    try {
      const user = await ArticleSchema.findByIdAndDelete(req.params.id)
      if (user) {
        res.send("Deleted")
      } else {
        const error = new Error(`User with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })
  

module.exports = articlesRoute
