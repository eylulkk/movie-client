import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Gidecek kullanıcı adı:", username);
    console.log("Gidecek şifre:", password);

    try {
      const response = await axios.post(
        "https://localhost:7297/api/auth/login",
        {
          username,
          password,
        }
      );
      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
      console.log("Giden veriler:", { username, password });
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Kullanıcı adı veya şifre hatalı!"
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#e3f2fd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Giriş Yap
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Kullanıcı Adı"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Giriş Yap
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link
            to="/forgot-password"
            style={{ textDecoration: "none", color: "#1565c0" }}
          >
            Şifrenizi mi unuttunuz?
          </Link>
        </Box>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Hesabınız yok mu?{" "}
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#1565c0" }}
            >
              Kayıt Ol
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
