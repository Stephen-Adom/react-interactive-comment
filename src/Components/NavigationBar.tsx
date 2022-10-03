import { getAuth } from "firebase/auth";
import { AuthService } from "../services/auth.service";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { resetAuthState } from "../hooks/authSlice";
import { resetCommentState } from "../hooks/commentSlice";

const NavigationBar = () => {
  const auth = getAuth();
  const authservice = new AuthService();
  const navigate = useNavigate();
  const toastRef = useRef<any>(null);
  const dispatch = useDispatch();

  const signOutUser = () => {
    authservice
      .signOutUser(auth)
      .then((response) => {
        dispatch(resetAuthState());
        dispatch(resetCommentState());
        navigate("/");
      })
      .catch((err: FirebaseError) => {
        toastRef.current?.show({
          severity: "error",
          summary: err.name,
          detail: err.message,
          life: 3000,
        });
      });
  };

  return (
    <>
      <nav
        id="navbar"
        className="fixed top-0 left-0 w-full bg-moderateBlue shadow-lg"
      >
        <div className="container w-[100%] sm:w-[100%] md:w-[80%] lg:w-[80%] flex items-center justify-between mx-auto py-4 px-3">
          <h5 className="text-white">Interactive Comment</h5>

          <div>
            <button
              type="button"
              className="flex items-center text-white"
              onClick={() => signOutUser()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-white mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Toast ref={toastRef} />
    </>
  );
};

export default NavigationBar;
