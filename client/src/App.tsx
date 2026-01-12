import "./App.css";
import Button from "@mui/material/Button";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import React, { useState } from "react";

interface Item {
  id?: number;
  title: string;
  date: string | undefined;
  isChecked?: boolean;
}

function App() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [alertMsg, setAlertMsg] = useState("");
  const [itemList, setItemList] = useState<Item[]>([]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(e.target.value);
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
    if (data.status === "success") {
      setItemList([...itemList, body]);
    }

    setAlertMsg(data.message);
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
          onChange={handleTitleChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateField
            label="Date"
            className="dateField"
            onChange={(val) => setDate(val)}
          />
        </LocalizationProvider>
        <Button
          className="todoBtn px-5 bg-cyan-500"
          variant="contained"
          onClick={handleClick}
        >
          Add Task
        </Button>
      </div>
      {itemList.length && (
        <ul>
          {itemList.map((item) => (
            <li key={item.id}>
              <Checkbox checked={item.isChecked} />
              Title : {item.title}
              Date : {item.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
