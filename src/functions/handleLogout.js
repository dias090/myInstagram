import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log("Logged out successfully");
    })
    .catch((error) => {
      console.log("Error logging out", error);
    });
};
export {handleLogout};