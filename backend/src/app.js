import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
import mongoose, { mongo } from "mongoose";
import Schema from 'mongoose/lib/schema.js';
import cors from "cors";
import https from "https";
import fs from "fs";

const mongoDBURL = process.env.MONGODB_URL;

const options = {
  key: fs.readFileSync("./keys/key.pem"),
  cert: fs.readFileSync("./keys/cert.pem")
};

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
  currentScore: {
    type: Number,
    default: 0,
  },
  highScore: {
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

const HTTPS_PORT = process.env.PORT || 8080;

https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${HTTPS_PORT}`);
});

app.use(express.json());
app.use(cors({
  origin: '*',
}));

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.put("/api/user/country/:uid/:country", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { country: req.params.country },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user country:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/score/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ currentScore: user.currentScore, highScore: user.highScore });
  } catch (err) {
    console.error("Error fetching user score:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/user/:uid/:score", async (req, res) => {
  try {
    const { score } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      { currentScore: score, highScore: Math.max(score, '$highScore') },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user score:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/user/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/webhooks/deleteuser", async (req, res) => {
  try {
    let id = req.body.data.id;
    const deletedUser = await User.findOneAndDelete({ uid: id });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`Deleted user ID: ${id}`);

    res.status(200).send(`Deleted User ${deletedUser.name} Successfully`);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(400).json({error: err.message});
  }
});

app.post("/api/webhooks/createuser", async (req, res) => {
  try {

    let id = req.body.data.id;
    let uname = req.body.data.username;
    const hashHex = crypto.createHash('sha256').update(id).digest('hex');
    let imUrl = `https://www.gravatar.com/avatar/${hashHex}?d=identicon`;

    console.log(`Creating user ID: ${id}, Username: ${uname}`);

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