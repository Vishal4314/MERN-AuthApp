import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./mix.css";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [inpVal, setInpVal] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleShowPassClick = () => {
    setShowPass(!showPass);
  };

  const handleInpValChange = (event) => {
    const { name, value } = event.target;
    setInpVal(() => {
      return {
        ...inpVal,
        [name]: value,
      };
    });
  };

  const handleLoginUser = async (event) => {
    event.preventDefault();

    const { email, password } = inpVal;

    if (email === "") alert("Enter Your Email");
    else if (!email.includes("@")) alert("Enter Valid Email");
    else if (password === "") alert("Enter Your Password");
    else if (password.length < 6)
      alert("Password must be atleast 6 characters long");
    else {
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const res = await response.json();
        if (res.status === 201) {
          localStorage.setItem("UsersDataToken", res.data.token);
          setInpVal({ ...inpVal, email: "", password: "" });
          navigate("/dash");
        }
      } catch (error) {
        alert("error in sending data to backend");
        console.log("error", error);
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, LOGIN</h1>
            <p>Hi, we are glad you are back, Please Login.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email Address"
                onChange={handleInpValChange}
                value={inpVal.email}
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your Password"
                  onChange={handleInpValChange}
                  value={inpVal.password}
                />
                <div className="showpass" onClick={handleShowPassClick}>
                  {showPass ? "Hide" : "Show"}
                </div>
              </div>
            </div>
            <button className="btn" onClick={handleLoginUser}>
              Login
            </button>
            <p>
              Don't have an Account? <NavLink to="/register"> Sign Up </NavLink>{" "}
            </p>
            <p style={{ color: "black", fontWeight: "bold" }}>
              Forgot Password{" "}
              <NavLink to="/password-reset"> Click Here </NavLink>{" "}
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
