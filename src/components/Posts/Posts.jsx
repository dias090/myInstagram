import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import UserCard from "../UserCard/UserCard";
import "./Posts.scss";
import Comments from "../Comments/Comments";

const Posts = ({ post, toggleComments, comments, setIsLoading }) => {
  const [author, setAuthor] = useState(null);
  const currentUser = auth.currentUser.uid;
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      if (post.authorId) {
        try {
          const authorRef = doc(db, "Users", post.authorId);
          const authorSnap = await getDoc(authorRef);
          if (authorSnap.exists()) {
            setAuthor(authorSnap.data());
          } else {
            console.log("No such author!");
          }
        } catch (error) {
          console.error("Error fetching author: ", error);
        }
      }
    };

    fetchAuthor();
  }, [post.authorId]);

  useEffect(() => {
    if (post.likes && post.likes.includes(currentUser)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
    const postRef = doc(db, "Posts", post.id);
    const currentUser = auth.currentUser.uid;

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser),
      });
      setIsLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser),
      });
      setIsLiked(true);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const postRef = doc(db, "Posts", post.id);
      const currentUser = auth.currentUser.uid;
      await updateDoc(postRef, {
        comments: arrayUnion({
          userId: currentUser,
          usersComments: comment,
          timestamp: new Date(),
        }),
      });
      setComment("");
    }
  };

  return (
    <div>
      <div className="post_container z-depth-2">
        {author && <UserCard user={author} setUsers={setAuthor} />}
        <div className="post-body">
          {post.img && <img src={post.img} alt="Post content" />}
          <h5>{post.comment}</h5>
          <div className="icons_container">
            <i
              className="material-icons"
              style={{ color: isLiked ? "red" : "unset" }}
              onClick={handleLike}
            >
              favorite
            </i>
            <i className="material-icons" onClick={toggleComments}>
              chat
            </i>
          </div>
          {post.likes.length || 0} likes
          <form
            action=""
            className="container"
            style={{ width: "90%", position: "relative" }}
            onSubmit={sendComment}
          >
            <input
              type="text"
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{color:"var(--text_color)"}}
            />
            <button type="submit" className="submit_button">
              <i className="material-icons" style={{color:"var(--text_color)"}}>comment</i>
            </button>
          </form>
        </div>
      </div>
      <Comments
        post={post}
        postId={post.id}
        isComments={comments}
        toggleComments={toggleComments}
        author={author}
        setAuthor={setAuthor}
      />
      <div className="underline"></div>
    </div>
  );
};

export default Posts;
