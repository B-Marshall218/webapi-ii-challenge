// const server = require("./server");
const express = require("express");
const postRouter = require("./data/postRouter");



const server = express();

server.use(express.json());

server.use("/api/posts", postRouter)

server.get('/', (req, res) => {
    res.send(`
      <h2>Its working</h>
      <p>Welcome to the Lambda Hubs API</p>
    `);
});

server.listen(4000, () => {
    console.log("Server running on 4000. Nice Job");
});