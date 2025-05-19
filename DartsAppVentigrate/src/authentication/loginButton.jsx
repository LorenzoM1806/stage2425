import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Button } from "@mantine/core";

const LoginButton = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup({ scopes: ["User.Read"] });
      instance.setActiveAccount(response.account)
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Button
        onClick={handleLogin}
        variant="outline"
        color="dark"
        bg="#fff"
        size="lg"
        w={290}
        style={{
          boxShadow: "2px 3px black",
          borderRadius: "8px"
        }}
      >
        Inloggen met Azure
      </Button>
    </>
  );
};

export default LoginButton;
