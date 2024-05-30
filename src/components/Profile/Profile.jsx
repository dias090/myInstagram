import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { query, where, getDocs, collection, orderBy } from "firebase/firestore";
import { Sidebar } from "../routes";
import "./Profile.scss";
import SecondLoader from "../Loading/SecondLoader";

import { handleFollow } from "../../functions/handleFollow";
import { handleUnFollow } from "../../functions/handleUnFollow";
import Loading from "../Loading/Loading";
import DefaultAvatar from "../../assets/defaultUser.svg";
import AddPost from "../AddPost/AddPost";
import Search from "../Search/Search";
import Comments from "../Comments/Comments";

const Profile = ({
  darkTheme,
  changeTheme,
  addCard,
  toggleAddCard,
  search,
  toggleSearch,
}) => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userListLoading, setUserListLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [editUser, setEditUser] = useState(false);

  const toggleEditUser = () => {
    setEditUser(!editUser);
  }

  const toggleComments = (postId) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: !prevComments[postId],
    }));
  };

  useEffect(() => {
    if (!username) {
      return;
    }
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "Users"),
          where("userName", "==", username)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserId(doc.id);
          setUser(userData);
        });
      } catch (error) {
        console.error("Error fetching user: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const postsColRef = collection(db, "Posts");
        const postsQuery = query(
          postsColRef,
          where("authorId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const postSnapshot = await getDocs(postsQuery);
        const postList = postSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postList);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user, userId]);

  if (isLoading) {
    return <Loading />;
  }

  function updateLocalState() {
    window.location.reload();
  }

  return (
    <div
      className="profile_container"
      data-theme={darkTheme ? "dark" : "white"}
    >
      <Sidebar
        darkTheme={darkTheme}
        changeTheme={changeTheme}
        setIsLoading={setIsLoading}
        addCard={addCard}
        toggleAddCard={toggleAddCard}
        search={search}
        toggleSearch={toggleSearch}
      />
      <div className="profile">
        <div className="profile_con">
          <div>
            <div className="img_con">
              {user && (
                <img
                  src={user.avatar ? user.avatar : DefaultAvatar}
                  alt="avatar"
                />
              )}
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col s4">
                <h5>{username}</h5>
              </div>
              <div className="col s4 button_con">
                {auth.currentUser?.uid !== userId && user && (
                  <button
                    className={`button ${
                      user.followers.includes(auth.currentUser.uid) &&
                      "unfollow"
                    }`}
                    onClick={
                      user.followers.includes(auth.currentUser.uid)
                        ? () =>
                            handleUnFollow(
                              userId,
                              setUserListLoading,
                              updateLocalState
                            )
                        : () =>
                            handleFollow(
                              userId,
                              setUserListLoading,
                              updateLocalState
                            )
                    }
                    type="button"
                    disabled={userListLoading}
                  >
                    {user.followers.includes(auth.currentUser.uid)
                      ? "Unfollow"
                      : "Follow"}
                    {userListLoading && <SecondLoader />}
                  </button>
                )}
                {/* {auth.currentUser?.uid == userId && user && (
                  <div>
                    <button className="button" onClick={toggleEditUser}>Edit</button>
                    <EditUser editUser={editUser} toggleEditUser={toggleEditUser}/>
                  </div>
                )} */}
              </div>
              <div className="col s4">
                {auth.currentUser?.uid == userId && (
                  <div className="button_con">
                    <button className="button" onClick={toggleAddCard}>
                      <i className="material-icons">add_box</i>
                    </button>
                    <AddPost
                      addCard={addCard}
                      toggleAddCard={toggleAddCard}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col s4">
                <p>{posts.length} posts</p>
              </div>
              <div className="col s4">
                <p>{user?.followers?.length || 0} followers</p>
              </div>
              <div className="col s4">
                <p>{user?.following?.length || 0} following</p>
              </div>
            </div>
            <div className="row">
              <div className="col s4">
                <p>{user?.fullName}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="profile_con">
          <h1 className="center">Posts</h1>
          <div className="posts_container">
            {posts.map((post) => (
              <div className="card" key={post.id}>
                <div
                  className="img_clicker"
                  onClick={() => toggleComments(post.id)}
                ></div>
                <img src={post.img} alt="" />
                <Comments
                  postId={post.id}
                  post={post}
                  isComments={comments[post.id]}
                  toggleComments={() => toggleComments(post.id)}
                  author={user}
                  setAuthor={setUser}
                />
              </div>
            ))}
          </div>
        </div>
        <Search
          toggleSearch={toggleSearch}
          search={search}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default Profile;
