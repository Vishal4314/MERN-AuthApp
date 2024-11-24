import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import PasswordReset from "./components/PasswordReset";
import ForgotPassword from "./components/ForgotPassword";
import Error from "./components/Error";
import { LoginContext } from "./components/contextProvider/Context";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();

  const userValid = async () => {
    const token = localStorage.getItem("UsersDataToken");

    if (!token) {
      return;
    } else {
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
          console.log("user not logged In");
        } else {
          console.log("user verified");
          setLoginData(res);
          navigate("/dash");
        }
      } catch (error) {
        alert("error in fetching user");
        console.log("error is", error);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      userValid();
      setIsLoading(false);
    }, 1000);
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
          <Header />
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact spath="/dash" element={<Dashboard />} />
            <Route exact path="/password-reset" element={<PasswordReset />} />
            <Route
              path="/forgotpassword/:id/:token"
              element={<ForgotPassword />}
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
