const express = require("express")
const mongoose = require("mongoose");

const ArticleSchema = require("./schema")
const ReviewSchema = require("../reviews/schema");

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
  articlesRoute.get("/:id/reviews", async (req, res) => {
    try {
      const reviews = await ArticleSchema.findById(req.params.id, { reviews: 1 });
      res.status(200).send(reviews.reviews);
    } catch (error) {
      console.log(error);
    }
  });
  

  articlesRoute.post("/:id", async (req, res) => {
    try {
      const newReview = new ReviewSchema(req.body);
      const review = await newReview.save();
    
      const article = await ArticleSchema.findByIdAndUpdate(
        req.params.id,
      {
          $push: {
            reviews: req.body,
          },
        },
        { runValidators: true, new: true }
      );
      res.status(201).send(article);
    } catch (error) {
      console.log(error);
    }
  });
  articlesRoute.get("/:id/reviews/:reviewID", async (req, res) => {
    try {
      console.log('here')
      const selectedReview = await ArticleSchema.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          reviews: {
            $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewID) },
          },
        }
      );
      if (selectedReview) {
        res.status(200).send(selectedReview.reviews[0]);
      } else {
        res
          .status(404)
          .send(`We couldn't find a review with the id ${req.params.reviewID}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
  
  articlesRoute.put("/:id/reviews/:reviewID", async (req, res) => {
    try {
      const selectedReview = await ArticleSchema.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          reviews: {
            $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewID) },
          },
        }
      );
      if (selectedReview) {
        const newReview = { ...selectedReview.reviews[0], ...req.body };
        const alteredReview = await ArticleSchema.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(req.params.id),
            "reviews._id": mongoose.Types.ObjectId(req.params.reviewID),
          },
          {
            $set: { "reviews.$": newReview },
          },
          {
            runValidators: true,
            new: true,
          }
        );
        res.status(200).send(alteredReview);
      } else {
        res
          .status(404)
          .send(`We couldn't find a review with the id ${req.params.reviewID}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
  
  articlesRoute.delete("/:id/reviews/:reviewID", async (req, res) => {
    try {
      const alteredReview = await ArticleSchema.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            reviews: { _id: mongoose.Types.ObjectId(req.params.reviewID) },
          },
        },
        { runValidators: true, new: true }
      );
      res.send(alteredReview);
    } catch (error) {
      console.log(error);
    }
  });

module.exports = articlesRoute
