import React, { useState } from "react";
import "./mix.css";

const PasswordReset = () => {
  const [emailVal, setEmailVal] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleInpValChange = (event) => {
    setEmailVal(event.target.value);
  };

  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    console.log("%%%%%%% inside the api call function");

    const response = await fetch("/sendpasswordlink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailVal }),
    });
    console.log("%%%%%%% after the api call done");
    const res = await response.json();
    if (res.status === 201) {
      console.log("%%%%%%% received response", res);
      setEmailVal("");
      setShowMessage(true);
    } else {
      alert("Invalid user");
    }
  };

  let content = showMessage ? (
    <>
      <p style={{ color: "green", fontWeight: "bold" }}>
        Password Reset Link Sent Succesfully to your Email{" "}
      </p>
    </>
  ) : (
    ""
  );

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Enter Your Email</h1>
          </div>
          {content}
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email Address"
                onChange={handleInpValChange}
                value={emailVal}
              />
            </div>
            <button className="btn" onClick={(e) => handleSubmitEmail(e)}>
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default PasswordReset;
