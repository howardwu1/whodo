import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);

    if (data.name === "asdf" && data.password === "asdf") {
      navigate("/dashboard");
    } else {
      setError("signin", {
        type: "custom",
      });
    }
  };

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
          <span className="login-error">Username is required</span>
        )}
        {errors.password && (
          <span className="login-error">Password is required</span>
        )}
        {errors.signin && (
          <span className="login-error">Username or Password is incorrect</span>
        )}
        <input type="submit" className="submit-btn" value="SIGN IN" />
        <a style={{ marginBottom: "20px", marginTop: "-20px" }} href="#">
          Forgot Password?
        </a>
        {/* <p>Username</p>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        <p>Password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}
      </form>
    </div>
  );
};

export default Login;
