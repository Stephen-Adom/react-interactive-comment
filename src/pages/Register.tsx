import { FirebaseError } from "firebase/app";
import { getAuth, UserCredential } from "firebase/auth";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { AuthService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export type formValueType = {
  email: string;
  password: string;
};

const loginSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "password is too short"),
});

const Register = () => {
  const authservice = new AuthService();
  const auth = getAuth();
  const toastRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValues: formValueType = {
    email: "",
    password: "",
  };

  const onSubmit = (values: formValueType) => {
    setLoading(true);
    loginUser(values);
  };

  const loginUser = (formValues: formValueType) => {
    authservice
      .createAccount(auth, formValues.email, formValues.password)
      .then((response: UserCredential) => {
        setLoading(false);
        navigate("/home");
      })
      .catch((error: FirebaseError) => {
        setLoading(false);

        if (error.code === "auth/email-already-in-use") {
          toastRef.current?.show({
            severity: "error",
            summary: error.name,
            detail: "Email address already in use",
            life: 3000,
          });
        } else {
          toastRef.current?.show({
            severity: "error",
            summary: error.name,
            detail: error.message,
            life: 3000,
          });
        }
      });
  };

  console.log(loading, "loading");

  return (
    <section
      id="Login-section"
      className="flex items-center justify-center h-screen"
    >
      <div className="login-form card w-[90%] sm:w-[90%] md:[70%] lg:w-[50%] bg-white shadow-lg rounded-lg ">
        <div className="card-body p-4">
          <h1 className="font-thin text-center text-2xl">
            Welcome to Interactive Comment
          </h1>
          <h3 className="font-bold text-center mt-3 text-lg">Register</h3>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
          >
            {({ errors, values, touched }) => (
              <>
                <Form className="w-[80%] sm:w-[80%] md:w-[70%] lg:w-[50%] mx-auto">
                  <div className="form-group">
                    <label htmlFor="email" className="text-gray-500">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={`form-control ${
                        errors.email && touched.email ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage name="email">
                      {(message) => (
                        <div className="error-message">{message}</div>
                      )}
                    </ErrorMessage>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="text-gray-500">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className={`form-control ${
                        errors.password && touched.password ? "is-invalid" : ""
                      }`}
                      autoComplete="true"
                    />
                    <ErrorMessage name="password">
                      {(message) => (
                        <div className="error-message">{message}</div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div className="mt-5 text-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-moderateBlue border border-moderateBlue hover:bg-blue-800 active:bg-blue-800 active:ring-1 ring-blue-500 ring-offset-2 px-5 py-2 rounded-md text-white disabled:bg-blue-300 disabled:border-blue-300"
                    >
                      {loading ? (
                        <span>Registering...</span>
                      ) : (
                        <span>Register</span>
                      )}
                    </button>
                  </div>

                  <Link
                    to="/"
                    className="text-gray-400 mt-2 font-medium text-center block"
                  >
                    Already a member, Click here to login
                  </Link>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </div>

      <Toast ref={toastRef} />
    </section>
  );
};

export default Register;
