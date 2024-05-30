import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import {
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./AddPost.scss"

const AddPost = ({addCard, toggleAddCard, setIsLoading}) => {
  const [comment, setComment] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (img) {
      setPreview(URL.createObjectURL(img));
    }
  }, [img]);

  const sendData = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const storage = getStorage();
      const storageRef = ref(storage, "posts/" + img.name);
      const uploadTask = uploadBytesResumable(storageRef, img);
      await uploadTask;

      const url = await getDownloadURL(uploadTask.snapshot.ref);
      const postsColRef = collection(db, "Posts");

      await addDoc(postsColRef, {
        comment: comment,
        img: url,
        authorId: auth.currentUser?.uid,
        comments: [],
        likes: [],
        createdAt: serverTimestamp(),
      });

      toggleAddCard();
      setComment("");
      setImg("");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleImage = (e) => {
    setImg(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      {addCard && (
        <div className="Add_Card_container requires-no-scroll">
          <div className="bg" onClick={toggleAddCard}></div>
          <div className="Add_Card">
            <p className="button_x z-depth-1 hoverable" onClick={toggleAddCard}>
              X
            </p>
            <form action="" className="container" onSubmit={sendData}>
              <h2 className="center">Post</h2>
              <input
                type="text"
                placeholder="comment"
                className="special_input"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="file-field input-field">
                <div className="btn">
                  <span>File</span>
                  <input type="file" required onChange={handleImage} />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
              </div>
                {preview && (
                  <img src={preview} alt="preview" className="preview" />
                )}
              <button
                type="submit"
                className="btn right"
                style={{ width: "100%" }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;
