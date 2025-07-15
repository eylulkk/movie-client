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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7297/api/auth/login",
        {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }
      );

      setSuccessMsg("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Kayıt sırasında hata oluştu!");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f4f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{ padding: 5, width: "100%", maxWidth: "450px" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Kayıt Ol
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Ad Soyad"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="E-posta"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Kullanıcı Adı"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Şifre"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            inputProps={{ minLength: 6 }}
          />
          <TextField
            label="Şifre Tekrar"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            inputProps={{ minLength: 6 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Kayıt Ol
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMsg}
          </Alert>
        )}

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Zaten hesabınız var mı?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "#1565c0" }}
            >
              Giriş Yap
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
