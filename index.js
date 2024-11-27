// middleware (pre-route)
const express = require("express");
const cors = require("cors");
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

// data
let notes = [
	{
		id: "1",
		content: "potato in a cowboy hat",
		important: "true",
	},
	{
		id: "2",
		content: "one singular grain of rice",
		important: "false",
	},
	{
		id: "3",
		content: "racoon in a garbage hat",
		important: "true",
	},
];

// utility
const generateId = () => {
	const maxId =
		notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
	return String(maxId + 1);
};

// get
app.get("/", (request, response) => {
	response.send("<h1>Nope</h1>");
});
app.get("/api/notes", (request, response) => {
	response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	const note = notes.find((note) => note.id === id);

	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

// delete
app.delete("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	notes = notes.filter((note) => note.id !== id);

	response.status(204).end();
});

// post
app.post("/api/notes", (request, response) => {
	const body = request.body;

	if (!body.content) {
		return response.status(400).json({
			error: "content missing",
		});
	}

	const note = {
		content: body.content,
		important: Boolean(body.important) || false,
		id: generateId(),
	};

	notes = notes.concat(note);

	// console.log(note);
	response.json(note);
});

// middleware (post-route)
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
