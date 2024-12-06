// which one of these works seems entirely random based on which app we're
// in so im just copy pasting both everywhere i guess
const mongoose = require("mongoose");
// import mongoose from "mongoose";

mongoose.set("strictQuery", false);

// if (process.argv.length < 3) {
// 	console.log("give password as argument");
// }
// const password = process.argv[2];

const url = process.env.MONGODB_URI;
mongoose
	.connect(url)
	.then((result) => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB: ", error.message);
	});

const noteSchema = new mongoose.Schema({
	content: { type: String, minLength: 5, required: true },
	important: Boolean,
});
noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Note", noteSchema);
// const Note = mongoose.model("Note", noteSchema);
