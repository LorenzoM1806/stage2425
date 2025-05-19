import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import React from "react";

const UserProfile = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutPopup();
    navigate("/");
  };

  return (
    <>
      <Button
        onClick={handleLogout}
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
        Uitloggen
      </Button>
    </>
  );
};

export default UserProfile;
