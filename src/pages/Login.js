import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../App";

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [hasForgottenPassword, setHasForgottenPassword] = useState(false);
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const { username, setUsername } = useContext(AppContext);

  const onSubmit = (data) => {
    if (data.name === "asdf" && data.password === "asdf") {
      setUsername(data.name);
      navigate("/dashboard");
    } else {
      setError("signin", {
        type: "custom",
      });
    }
  };

  const onSubmitForgotPassword = (data) => {
    console.log("this is a placholder");
    setUsername(data.name);
    setIsPasswordResetSent(true);
  };

  if (!hasForgottenPassword) {
    return (
      <div style={{ paddingLeft: "2em", paddingRight: "2em" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="sign-in">
          <h2> Sign In </h2>
          <h5> Sign in to use WhoDo project management and billing</h5>
          <label htmlFor="name">Username or Email</label>
          <input
            {...register("name", { required: true })}
            id="name"
            onClick={() => {
              clearErrors("signin");
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            {...register("password", { required: true })}
            id="password"
            type="password"
            onClick={() => {
              clearErrors("signin");
            }}
          />
          {errors.name && (
            <span className="login-error">Username or email is required</span>
          )}
          {errors.password && (
            <span className="login-error">Password is required</span>
          )}
          {errors.signin && (
            <span className="login-error">
              Username or Password is incorrect
            </span>
          )}
          <input type="submit" className="submit-btn" value="SIGN IN" />
          <Link
            style={{ marginBottom: "20px", marginTop: "-20px" }}
            onClick={() => setHasForgottenPassword(true)}
          >
            Forgot Password?
          </Link>
        </form>
      </div>
    );
  } else {
    return (
      <div style={{ paddingLeft: "2em", paddingRight: "2em" }}>
        <form
          onSubmit={handleSubmit(onSubmitForgotPassword)}
          className="sign-in"
        >
          <h2> Forgot Password </h2>
          <label htmlFor="name">Username or Email</label>

          {!isPasswordResetSent && username === "" ? (
            <>
              <input {...register("name", { required: true })} id="name" />
              {errors.name && (
                <span className="login-error">
                  Username or email is required
                </span>
              )}
              <input
                type="submit"
                className="submit-btn"
                value="SEND RESET EMAIL"
              />
            </>
          ) : (
            <>
              <h3>{username}</h3>
              <p style={{ textAlign: "left" }}>
                Thank you! If user/email "{username}" is in our systems we have
                sent you an email with instructions on how to reset your
                password! Please reach out to{" "}
                <a href="mailto:whodo-support@gmail.com">
                  whodo-support@gmail.com
                </a>{" "}
                if there are any issues.
              </p>
            </>
          )}
        </form>
      </div>
    );
  }
};

export default Login;
