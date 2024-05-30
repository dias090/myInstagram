import React, { useEffect, useState } from "react";
import { Sidebar } from "../routes";
import "./Mainpage.scss";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Post from "../Posts/Posts";
import UserList from "../Userslist/Userlist";
import AddPost from "../AddPost/AddPost";
import Search from "../Search/Search";

const Mainpage = ({
  darkTheme,
  changeTheme,
  setIsLoading,
  handleFollow,
  handleUnfollow,
  addCard,
  toggleAddCard,
  search,
  toggleSearch,
  comments,
  toggleComments,
}) => {
  const [posts, setPosts] = useState([]);
  const currentUser = auth.currentUser;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      if (!currentUser) {
        setPosts([]);
        return;
      }
      
      try {
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const following = userDoc.data().following;

        if (following && following.length > 0) {
          const postsColRef = collection(db, "Posts");
          const postsQuery = query(
            postsColRef,
            where("authorId", "in", following),
            orderBy("createdAt", "desc")
          );
          const postSnapshot = await getDocs(postsQuery);
          const postList = postSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postList);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    try{
      fetchPosts();
    }finally{
      setIsLoading(false);
    }
  }, [currentUser, setIsLoading]);

  return (
    <div
      className="Homepage-container"
      data-theme={darkTheme ? "dark" : "white"}
    >
      <Sidebar
        darkTheme={darkTheme}
        changeTheme={changeTheme}
        setIsLoading={setIsLoading}
        addCard={addCard}
        toggleAddCard={toggleAddCard}
        toggleSearch={toggleSearch}
      />
      <div className="homepage_container">
        {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              toggleComments={() => toggleComments(post.id)}
              comments={comments[post.id]}
              setIsLoading={setIsLoading}
            />
        ))}
      </div>
      {width >= 900 && (
        <UserList
          setIsLoading={setIsLoading}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />
      )}
      <AddPost
        addCard={addCard}
        toggleAddCard={toggleAddCard}
        setIsLoading={setIsLoading}
      />
      <Search
        search={search}
        toggleSearch={toggleSearch}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default Mainpage;
