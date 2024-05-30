import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import "./Comments.scss";
import UsersComments from "../UsersComments/UsersComments";
import UserCard from "../UserCard/UserCard";

const Comments = ({
  post,
  postId,
  toggleComments,
  isComments,
  author,
  setAuthor,
}) => {
  const currentUser = auth.currentUser.uid;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const fetchComments = async () => {
    try {
      const postRef = doc(db, "Posts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setComments(postSnap.data().comments || []);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  useEffect(() => {
    if (post && post.likes && post.likes.includes(currentUser)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    fetchComments();
  }, [post, postId]);

  const sendComment = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const postRef = doc(db, "Posts", post.id);
        await updateDoc(postRef, {
          comments: arrayUnion({
            userId: currentUser,
            usersComments: comment,
            timestamp: new Date(),
          }),
        });
        await fetchComments();
        setComment("");
      } catch (error) {
        console.error("Error sending comment: ", error);
      }
    }
  };

  const handleLike = async () => {
    const postRef = doc(db, "Posts", post.id);

    if (isLiked) {
      setIsLiked(false);
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser),
      });
    } else {
      setIsLiked(true);
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser),
      });
    }
  };

  return (
    <div>
      {isComments && (
        <div className="comments_container requires-no-scroll">
          <div className="bg" onClick={toggleComments}></div>
          <div className="comments">
            <div className="img_con">
              <UserCard
                user={author}
                setUser={setAuthor}
                toggleComments={toggleComments}
              />
              {post && (
                <>
                  <img src={post.img} alt="" />
                  <h5>{post.comment}</h5>
                  <div className="icons_container">
                    <i
                      className="material-icons"
                      style={{ color: isLiked ? "red" : "unset" }}
                      onClick={handleLike}
                    >
                      favorite
                    </i>
                    &emsp;
                    {post.likes ? post.likes.length : 0} likes
                  </div>
                  <form
                    className=""
                    style={{ position: "relative" }}
                    onSubmit={sendComment}
                  >
                    <input
                      type="text"
                      placeholder="Comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit" className="submit_button">
                      <i className="material-icons">comment</i>
                    </button>
                  </form>
                </>
              )}
            </div>
            <div className="comments_con">
              {comments.map((comment, index) => (
                <div key={index}>
                  <UsersComments
                    userId={comment.userId}
                    comment={comment.usersComments}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;

