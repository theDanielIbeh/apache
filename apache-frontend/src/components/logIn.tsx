import React, { useContext } from "react";
import Input from "./common/input";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import store from "store";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import axiosInstance from "../helpers/axios";

const LogIn = () => {
  interface Values {
    username: string;
    password: string;
  }

  var navigate: NavigateFunction = useNavigate();

  const signUpSchema = Yup.object().shape({
    username: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(5).label("Password"),
  });

  const { setCurrentUser } = useContext(AuthContext);
  const [error, setError] = React.useState({ username: "", password: "" });

  const handleSubmit = async (
    values: {
      username: string;
      password: string;
    },
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const username = values.username;
    const password = values.password;

    axiosInstance()
      .post("/users/auth", {
        username,
        password,
      })
      .then((res: any) => {
        console.log(res);
        if (res.data) {
          console.log(res.data.password);
          store.set("token", res.data.token);
          store.set("my_app_user", res.data);
          setCurrentUser(res.data);
        }
        navigate("/dashboard");
      })
      .catch((error: any) => {
        if (error.response.data.error) {
          if (error.response.data.key === "username") {
            setError({ username: error.response.data.message, password: "" });
          } else if (error.response.data.key === "password") {
            setError({ username: "", password: error.response.data.message });
          }
        }
        console.log(error);
      });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h1>Log In</h1>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={signUpSchema}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>,
        ) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
      >
        {({ values, errors, touched }) => (
          <Form
            action=""
            onSubmit={(e) => {
              handleSubmit(values, e);
            }}
          >
            <Input
              error={errors.username || error.username}
              touched={touched.username}
              name="username"
              label="Email"
              type="username"
              value={values.username}
              placeholder="john.doe@mail.com"
            ></Input>
            <Input
              error={errors.password || error.password}
              touched={touched.password}
              name="password"
              label="Password"
              type="password"
              value={values.password}
            ></Input>
            <button className="btn btn-primary mt-3" type="submit">
              {" "}
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Haven't signed up?{" "}
        <span
          onClick={() => {
            navigate("/", { replace: true });
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default LogIn;
