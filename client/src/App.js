import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Comments from "./components/Comments";
import Task from "./components/Task";
import Login from "./components/Login";
import TasksContainer from "./components/TasksContainer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/tasks' element={<TasksContainer />} />
        <Route path='/comments/:category/:id' element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
