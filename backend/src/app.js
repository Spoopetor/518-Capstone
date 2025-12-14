import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose, { mongo } from "mongoose";
import Schema from 'mongoose/lib/schema.js';

const mongoDBURL = process.env.MONGODB_URL;

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true, // Ensures uids are unique
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  friendIds: {
    type: [String],
    default: [],
  },
  country: {
    type: String,
    default: 'none',
  },
});

const User = mongoose.model('User', userSchema);

mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.post("/api/webhooks/createuser", async (req, res) => {
  try {

    console.log(req.body);
    let id = req.body.data.id;
    let uname = req.body.data.username;
    let imUrl = req.body.data.image_url;

    const newUser = new User({
      uid: id,
      name: uname,
      imageUrl: imUrl,
    });

    await newUser.save();
    res.status(200).send(`Created User ${uname} Successfully`);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({error: err.message});
  }

});