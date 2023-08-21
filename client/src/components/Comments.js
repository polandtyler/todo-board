import React, { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = socketIO.connect("http://localhost:4000");

const Comments = () => {
  const { category, id } = useParams();
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const addComment = (e) => {
    e.preventDefault();
    /*
    👇🏻 sends the comment, the task category, item's id and the userID.
     */
    socket.emit("addComment", {
      comment,
      category,
      id,
      userId: localStorage.getItem("userId"),
    });
    setComment("");
  };

  //👇🏻 Listens to the comments event
  useEffect(() => {
    socket.on("comments", (data) => setCommentList(data));
  }, []);

  useEffect(() => {
    socket.emit("fetchComments", { category, id });
  }, [category, id]);

  //...other listeners
  return (
    <div className='comments__container'>
      <form className='comment__form' onSubmit={addComment}>
        ...
      </form>

      {/** 👇🏻 Displays all the available comments*/}
      <div className='comments__section'>
        <h2>Existing Comments</h2>
        {commentList.map((comment) => (
          <div key={comment.id}>
            <p>
              <span style={{ fontWeight: "bold" }}>{comment.text} </span>by{" "}
              {comment.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
