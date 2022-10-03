import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthUserType } from "./hooks/states";
import { saveAuthState } from "./hooks/authSlice";
import { useAppDispatch } from "./hooks/hooks";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const authUser: AuthUserType = {
          uid: user.uid,
          email: user.email,
          image: "",
        };

        dispatch(saveAuthState(authUser));

        navigate("/home");
      } else {
        navigate("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <div className="App">
      <Outlet></Outlet>
    </div>
  );
}

export default App;
