import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  //   const [userName, setUserName] = useState("");
  //   const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="Username" {...register("example")} />
        <input {...register("exampleRequired", { required: true })} />
        {errors.exampleRequired && <span>This field is required</span>}
        <input type="submit" />

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
