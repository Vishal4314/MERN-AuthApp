import "./header.css";
import React, { useContext, useState } from "react";
import { LoginContext } from "./contextProvider/Context";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { loginData, setLoginData } = useContext(LoginContext);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAuthCloseClick = () => {
    setAnchorEl(null);
    navigate("/dash");
  };

  const handleUnauthCloseClick = () => {
    setAnchorEl(null);
    navigate("*");
  };

  const handleLogoutClick = async () => {
    setAnchorEl(null);
    const token = localStorage.getItem("UsersDataToken");
    console.log("the token we send is", token);

    //few changes in headers, so to remove cookies as well, like accept and credentials
    try {
      const response = await fetch("/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          Accept: "application/json",
        },
        credentials: "include",
      });

      const res = await response.json();

      if (res.status === 201) {
        console.log("user logged out");
        localStorage.removeItem("UsersDataToken");
        setLoginData(false);
        navigate("/");
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("couldn't make the logout api call from frontend!!", error);
    }
  };

  return (
    <>
      <header>
        <nav>
          <h1>HP CLOUD</h1>
          <div className="avtar">
            {loginData.validUserOne ? (
              <Avatar
                style={{
                  backgroundColor: "salmon",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
                onClick={handleClick}
              >
                {loginData.validUserOne.name[0].toUpperCase()}
              </Avatar>
            ) : (
              <Avatar
                style={{ backgroundColor: "blue" }}
                onClick={handleClick}
              />
            )}
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            disableAutoFocusItem
          >
            {loginData.validUserOne ? (
              <>
                <MenuItem onClick={handleAuthCloseClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleUnauthCloseClick}>Profile</MenuItem>
            )}
          </Menu>
        </nav>
      </header>
    </>
  );
};

export default Header;
