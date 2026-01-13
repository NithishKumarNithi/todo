const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 7005;

let itemsId = 3;

// middleware
app.use(cors());
app.use(express.json());

let items = [
  {
    id: 1,
    title: "Title One",
    date: "12/05/2025",
    isChecked: false,
  },
  {
    id: 2,
    title: "Title Two",
    date: "20/06/2025",
    isChecked: true,
  },
  {
    id: 3,
    title: "Title Three",
    date: "30/09/2025",
    isChecked: false,
  },
];

// test route
app.get("/", async (req, res) => {
  res.json({ data: items });
});

// create new item
app.post("/todos", async (req, res) => {
  let { title, date } = req.body;
  itemsId = itemsId + 1;
  items.push({
    id: itemsId,
    title: title,
    date: date,
    isChecked: false,
  });

  res.status(200).json({
    message: `Created to-do item with unique ID : ${itemsId}`,
    status: "success",
  });
});

// update item
app.put("/todos", async (req, res) => {
  let { id, title, date } = req.body;
  let newItem = items.map((item) => {
    if (item.id === parseInt(id)) {
      return {
        id: item.id,
        title: title,
        date: date,
        isChecked: item.isChecked,
      };
    }
    return item;
  });
  items = [...newItem];
  res.status(200).json({ message: `update a to-do item`, status: "success" });
});

// delete item
app.delete("/todos/:id", async (req, res) => {
  let { id } = req.params;
  let newItem = items.filter((item) => item.id !== parseInt(id));
  items = [...newItem];
  res.status(200).json({ message: `Deleted Item`, status: "success" });
});

// update status
app.patch("/todos/:id/complete", async (req, res) => {
  let { id } = req.params;
  let newItem = items.map((item) => {
    if (item.id === parseInt(id)) {
      return {
        id: item.id,
        title: item.title,
        date: item.date,
        isChecked: true,
      };
    }
    return item;
  });
  items = [...newItem];
  res
    .status(200)
    .json({ message: `update Item complete to true`, status: "success" });
});

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
