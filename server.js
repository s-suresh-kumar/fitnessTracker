const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
var path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.post("/api/workouts", ({ body }, res) => {
  console.log('body', body);
  db.Workout.create({ body })
    .then(dbWorkout => {
      console.log(dbWorkout);
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      console.log(message);
    });
});

app.put("/api/workouts/:id", ({ params, body }, res) => {
  db.Workout.findByIdAndUpdate(
    params.id,
    { $push: { exercises: body } },
    // "runValidators" will ensure new exercises meet our schema requirements
    { new: true, runValidators: true }
  )
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
  // let _id = mongoose.Types.ObjectId(params.id);

  // db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true })
  //   .then(dbWorkout => {
  //     res.json(dbWorkout);
  //   })
  //   .catch(err => {
  //     res.json(err);
  //   });
});


app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}).limit(7)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      console.log('dbWorkout', dbWorkout);
      console.log('current', dbWorkout[9].totalDuration);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "public/exercise.html"));
});

app.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname, "public/stats.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});