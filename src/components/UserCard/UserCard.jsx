import React, { useState } from "react";
import { Link } from "react-router-dom";


import {handleFollow} from "../../functions/handleFollow";
import {handleUnFollow} from "../../functions/handleUnFollow";

import "./UserCard.scss";
import DefaultUser from "../../assets/defaultUser.svg"
import SecondLoader from "../Loading/SecondLoader";

function UserCard({ user, setUsers, toggleSearch,toggleComments }) {
  const [userListLoading, setUserListLoading] = useState(false);
  return (
    <div className="userCard" key={user.id} >
      <Link to={`/profile/${user.userName}`} className="user_card_element" onClick={toggleSearch ? toggleSearch : toggleComments}>
        <div className="avatar_con">
          <img src={user.avatar ? user.avatar : DefaultUser} alt="avatar" className="user_avatar" />
        </div>
        <div className="username_con">
          <p>{user.userName}</p>
          <p>{user.fullName}</p>
        </div>
      </Link>
      <div className="user_card_element">
        <button
          className={`button ${user.following && "unfollow"}`}
          onClick={() => {
            user.following
              ? handleUnFollow(user.id, setUserListLoading, () =>
                  updateLocalState(user.id, setUsers)
                )
              : handleFollow(user.id, setUserListLoading, () =>
                  updateLocalState(user.id, setUsers)
                );
          }}
          type="button"
          disabled={userListLoading ? true : false}
        >
          {userListLoading ? <SecondLoader/> : user.following ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}

function updateLocalState(userId, setUsers) {
  setUsers((users) =>
    users.map((u) => (u.id === userId ? { ...u, following: !u.following } : u))
  );
}

export default UserCard;
