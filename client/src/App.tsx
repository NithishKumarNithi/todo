import "./App.css";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";

interface Item {
  id?: number;
  title: string;
  date: string | undefined;
  isChecked?: boolean;
}

function App() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs(""));
  const [alertMsg, setAlertMsg] = useState("");
  const [itemList, setItemList] = useState<Item[]>([]);
  const [isEdit, setIsEdit] = useState<Item | null>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value);
  }

  function handleEdit(data: Item) {
    setIsEdit(data);
    let item = itemList.find((item) => item.id === data.id);
    console.log(item);
    setTitle(data.title);
    setDate(dayjs(data.date));
  }

  async function handleCheckbox(id: number) {
    let res = await fetch(`http://localhost:7005/todos/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Request failed");
    }
    let data = await res.json();
    console.log(data);
    await fetchLists();
  }

  async function handleDelete(id: number): Promise<void> {
    let res = await fetch(`http://localhost:7005/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      console.error("Request failed");
    }
    let data = await res.json();
    console.log(data);
    await fetchLists();
  }

  async function fetchLists() {
    let res = await fetch("http://localhost:7005");
    if (!res.ok) {
      console.error("Request failed");
    }
    let data = await res.json();
    console.log(data);
    setItemList(data.data);
  }

  async function handleClick(): Promise<void> {
    let _date = date?.format("MM/DD/YYYY");
    let body = { title: title, date: _date };
    let res = await fetch("http://localhost:7005/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Request failed");
    }

    let data = await res.json();

    setAlertMsg(data.message);
    await fetchLists();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold px-2 py-5 bg-cyan-500 text-white">
        TodoList
      </h1>
      <div className="w-full flex flex-col justify-between my-8 px-4">
        {alertMsg && (
          <Alert variant="filled" severity="success">
            {alertMsg}
          </Alert>
        )}
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          className="titleField"
          value={title}
          onChange={handleTitleChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            label="Date"
            className="dateField"
            value={date}
            onChange={(val) => setDate(val)}
          />
        </LocalizationProvider>
        {isEdit ? (
          <Button className="todoBtn px-5 bg-cyan-500" variant="contained">
            Update Task
          </Button>
        ) : (
          <Button
            className="todoBtn px-5 bg-cyan-500"
            variant="contained"
            onClick={handleClick}
          >
            Add Task
          </Button>
        )}
      </div>
      {itemList.length && (
        <ul>
          {itemList.map((item) => (
            <li key={item.id}>
              <Checkbox
                checked={item.isChecked}
                onClick={() => handleCheckbox(item.id as number)}
              />
              <span className="me-4">Title : {item.title} </span>
              <span>Date : {item.date}</span>
              <Stack direction="row" spacing={2}>
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item.id as number)}>
                  Delete
                </Button>
              </Stack>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
