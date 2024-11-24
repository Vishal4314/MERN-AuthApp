import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./mix.css";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [inpVal, setInpVal] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleShowPassClick = () => {
    setShowPass(!showPass);
  };
  const handleShowConfirmPassClick = () => {
    setShowConfirmPass(!showConfirmPass);
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

  const handleAddUserData = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = inpVal;

    if (name === "") alert("Enter your Name.");
    else if (email === "") alert("Enter your email.");
    else if (!email.includes("@")) alert("Enter valid email.");
    else if (password === "") alert("Enter your password.");
    else if (password.length < 6)
      alert("Password should be atleast 6 characters long");
    else if (confirmPassword === "") alert("Enter your confirm Password.");
    else if (confirmPassword.length < 6)
      alert("Confirm Password should be atleast 6 characters long");
    else if (password !== confirmPassword)
      alert("Confirm Password and password are not same");
    else {
      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });
        const res = await response.json();
        if (res.status === 201) {
          alert(res.message);
          setInpVal({
            ...inpVal,
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        alert("Error in registering User, Try Agin");
        console.log("error while registering", error);
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Sign Up</h1>
            <p style={{ textAlign: "center" }}>
              We are glad that you will be using Project Cloud to manage <br />
              your tasks! We hope that you will like it.
            </p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your Name"
                value={inpVal.name}
                onChange={handleInpValChange}
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email Address"
                value={inpVal.email}
                onChange={handleInpValChange}
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
                  value={inpVal.password}
                  onChange={handleInpValChange}
                />
                <div className="showpass" onClick={handleShowPassClick}>
                  {showPass ? "Hide" : "Show"}
                </div>
              </div>
            </div>
            <div className="form_input">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="two">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={inpVal.confirmPassword}
                  onChange={handleInpValChange}
                />
                <div className="showpass" onClick={handleShowConfirmPassClick}>
                  {showConfirmPass ? "Hide" : "Show"}
                </div>
              </div>
            </div>

            <button className="btn" onClick={handleAddUserData}>
              Sign Up
            </button>
            <p>
              Already have an Account? <NavLink to="/"> Login </NavLink>{" "}
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
