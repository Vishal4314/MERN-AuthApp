import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./contextProvider/Context";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Dashboard = () => {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const userValid = async () => {
    const token = localStorage.getItem("UsersDataToken");

    try {
      const response = await fetch("/validUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const res = await response.json();

      if (res.status === 401 || !res) {
        console.log("redirect to error page");
        navigate("*");
      } else {
        setLoginData(res);
        console.log("user verified");
        navigate("/dash");
      }
    } catch (error) {
      alert("error in fetching user");
      console.log("error is", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      userValid();
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            Loading
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="./man.png"
              style={{ width: "200px", marginTop: "20px" }}
              alt="person"
            />
            <h1>User Email: {loginData ? loginData.validUserOne.email : ""}</h1>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
