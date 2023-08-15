// app
const express = require("express");
const app = express();
const PORT = 4000;

// networking
const http = require("http").Server(app);
const cors = require("cors");
const { SocketAddress } = require("net");
const { timingSafeEqual } = require("crypto");

const io = require("socket.io")(http);

// socket
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// gen a rando string
const fetchID = () => Math.random().toString(36).substring(2, 10);

// test data
let tasks = {
  pending: {
    title: "pending",
    items: [
      {
        id: fetchID(),
        title: "Send the Figma file to Dima",
        comments: [],
      },
    ],
  },
  ongoing: {
    title: "ongoing",
    items: [
      {
        id: fetchID(),
        title: "Review GitHub issues",
        comments: [
          {
            name: "David",
            text: "Ensure you review before merging",
            id: fetchID(),
          },
        ],
      },
    ],
  },
  completed: {
    title: "completed",
    items: [
      {
        id: fetchID(),
        title: "Create technical contents",
        comments: [
          {
            name: "Dima",
            text: "Make sure you check the requirements",
            id: fetchID(),
          },
        ],
      },
    ],
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("taskDragged", (data) => {
    const { source, destination } = data;

    //👇🏻 Gets the item that was dragged
    const itemMoved = {
      ...tasks[source.droppableId].items[source.index],
    };
    console.log("DraggedItem >>> ", itemMoved);

    //👇🏻 Removes the item from the its source
    tasks[source.droppableId].items.splice(source.index, 1);

    //👇🏻 Add the item to its destination using its destination index
    tasks[destination.droppableId].items.splice(
      destination.index,
      0,
      itemMoved
    );

    //👇🏻 Sends the updated tasks object to the React app
    socket.emit("tasks", tasks);

    console.log("Source >>>", tasks[source.droppableId].items);
    console.log("Destination >>>", tasks[destination.droppableId].items);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({ tasks });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
