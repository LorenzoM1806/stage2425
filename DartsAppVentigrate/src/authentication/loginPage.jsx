import React from "react";
import LoginButton from "./loginButton.jsx";
import LogoVentigrate from "../assets/LogoVentigrate.png";
import {
  BackgroundImage,
  Box,
  Card,
  Center,
  getGradient,
  Image,
  Paper,
  Stack,
  useMantineTheme,
} from "@mantine/core";

function LoginPage() {
  return (
    <Stack align="center" justify="center" gap="md" p={20} h={'50rem'}>
      <Paper
        bg="var(--mantine-color-dark-9)"
        size="xs"
        radius="lg"
        shadow="md"
        p={20}
      >
        <Image h="auto" w={250} fit="contain" src={LogoVentigrate} p={15}/>
      </Paper>
      <LoginButton>Inloggen met Azure</LoginButton>
    </Stack>
  );
}

export default LoginPage;
