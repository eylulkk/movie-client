import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://localhost:7297/api/movies/list?page=${page}&query=${encodeURIComponent(
          query
        )}`
      );
      setMovies(res.data.results);
    } catch (error) {
      console.error("Film listesi alınamadı", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page, query]);

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          maxWidth: 1500,
          mx: "auto",
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          px: 2,
          py: 1,
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Film, dizi veya kişi ara"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#888" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={fetchMovies}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    borderRadius: "20px",
                    px: 2,
                    py: 0.5,
                    fontSize: "0.85rem",
                    "&:hover": {
                      backgroundColor: "#125ca1",
                    },
                  }}
                >
                  Ara
                </IconButton>
              </InputAdornment>
            ),
            sx: { fontSize: 16 },
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "right", marginTop: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {movies?.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image";

            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={movie.id}>
                <Link
                  to={`/movies/${movie.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: 400,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={posterUrl}
                      alt={movie.title}
                      sx={{ width: "100%", height: 300, objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" noWrap>
                        {movie.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {movie.release_date?.slice(0, 4) || "Tarih yok"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginTop: 4,
        }}
      >
        <Button
          variant="contained"
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          Önceki
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
          disabled={loading}
        >
          Sonraki
        </Button>
      </Box>
    </Box>
  );
};

export default MoviesList;
