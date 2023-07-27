import React, { useContext } from "react";
import Input from "./common/input";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import axiosInstance from "../helpers/axios";
import store from "store";

const SignUp = () => {
  interface Values {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
  }
  var navigate: NavigateFunction = useNavigate();

  const { setCurrentUser } = useContext(AuthContext);
  const [error, setError] = React.useState("");

  const handleSubmit = async (
    values: {
      username: string;
      firstName: string;
      lastName: string;
      password: string;
    },
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const username = values.username;
    const firstName = values.firstName;
    const lastName = values.lastName;
    const password = values.password;

    axiosInstance()
      .post("/users", {
        username,
        firstName,
        lastName,
        password,
      })
      .then((res: any) => {
        if (res.data) {
          console.log(res.data.password);
          store.set("token", res.data.password);
          store.set("my_app_user", res.data);
          setCurrentUser(res.data);
        }
        navigate("/login", { replace: true });
      })
      .catch((error: any) => {
        if (error.response.data.error) {
          setError(error.response.data.message);
        }
        console.log(error);
      });
  };

  const getCharacterValidationError = (str: string) => {
    return `Your password must have at least 2 ${str} character`;
  };

  const signUpSchema = Yup.object().shape({
    username: Yup.string().required("Username is required").label("Username"),
    password: Yup.string()
      .required("Password is required")
      .min(8)
      .label("Password")
      .matches(/[0-9]{2}/, getCharacterValidationError("digit"))
      .matches(/[A-Z]{2}/, getCharacterValidationError("uppercase")),
    firstName: Yup.string()
      .required("First name is required")
      .min(3)
      .label("First Name"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(3)
      .label("Last Name"),
    email: Yup.string().required().email().label("Email"),
  });

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h1>Sign Up</h1>
      <Formik
        initialValues={{
          username: "",
          firstName: "",
          lastName: "",
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
              error={errors.firstName}
              touched={touched.firstName}
              name="firstName"
              label="First Name"
              type="text"
              value={values.firstName}
              placeholder="John"
            ></Input>
            <Input
              error={errors.lastName}
              touched={touched.lastName}
              name="lastName"
              label="Last Name"
              type="text"
              value={values.lastName}
              placeholder="Doe"
            ></Input>
            <Input
              error={errors.username || error}
              touched={touched.username}
              name="username"
              label="Email"
              type="email"
              value={values.username}
              placeholder="john.doe@mail.com"
            ></Input>
            <Input
              error={errors.password}
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
        Already signed up?{" "}
        <span
          onClick={() => {
            navigate("/login", { replace: true });
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Log In
        </span>
      </p>
    </div>
  );
};

export default SignUp;
