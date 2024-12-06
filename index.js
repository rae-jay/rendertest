// middleware (pre-route)
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const requestLogger = (request, response, next) => {
	console.log("Method: ", request.method);
	console.log("Path: ", request.path);
	console.log("Body: ", request.body);
	console.log("-----");
	next();
};

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(requestLogger);

const Note = require("./models/note");
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// data
// let notes = [
// 	{
// 		id: "1",
// 		content: "potato in a cowboy hat",
// 		important: "true",
// 	},
// 	{
// 		id: "2",
// 		content: "one singular grain of rice",
// 		important: "false",
// 	},
// 	{
// 		id: "3",
// 		content: "racoon in a garbage hat",
// 		important: "true",
// 	},
// ];

// 	// if (result.length < 5) {
// 	// 	const oldNote = notes[result.length - 2];
// 	// 	const note = new Note({
// 	// 		content: oldNote.content,
// 	// 		important: oldNote.important,
// 	// 	});
// 	// 	note.save().then((result) => {
// 	// 		console.log("note saved");
// 	// 		mongoose.connection.close();
// 	// 	});
// 	// }
// });

//

// utility
// const generateId = () => {
// 	const maxId =
// 		notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
// 	return String(maxId + 1);
// };

// get
app.get("/", (request, response) => {
	response.send("<h1>Nope</h1>");
});
app.get("/api/notes", (request, response) => {
	// response.json(notes);
	Note.find({}).then((result) => {
		response.json(result);
	});
});

app.get("/api/notes/:id", (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			response.json(note);
		})
		.catch((error) => next(error));

	// const id = request.params.id;
	// const note = notes.find((note) => note.id === id);

	// if (note) {
	// 	response.json(note);
	// } else {
	// 	response.status(404).end();
	// }
});

// delete
app.delete("/api/notes/:id", (request, response, next) => {
	Note.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));

	// const id = request.params.id;
	// notes = notes.filter((note) => note.id !== id);

	// response.status(204).end();
});

// post
app.post("/api/notes", (request, response, next) => {
	const body = request.body;

	// if (!body.content) {
	// 	return response.status(400).json({
	// 		error: "content missing",
	// 	});
	// }

	const note = new Note({
		content: body.content,
		important: body.important || false,
		// id: generateId(),
	});

	note.save()
		.then((savedNote) => {
			response.json(savedNote);
		})
		.catch((error) => next(error));

	// notes = notes.concat(note);
	// // console.log(note);
	// response.json(note);
});

// put
app.put("/api/notes/:id", (request, response, next) => {
	const { content, important } = request.body;
	// const note = {
	// 	content: body.content,
	// 	important: body.important,
	// };

	Note.findByIdAndUpdate(
		request.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

// middleware (post-route)
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);

// for some reason we're replacing this with the .env PORT i guess
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
// 	console.log(`server running on port ${PORT}`);
// });

//
