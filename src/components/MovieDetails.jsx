import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CircularProgress,
  TextField,
  Button,
  Rating,
  Divider,
  Paper,
} from "@mui/material";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, videosRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=77c3d65c6bcbe51c765e30b4b27f6521&language=tr-TR`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=77c3d65c6bcbe51c765e30b4b27f6521&language=tr-TR`
          ),
        ]);
        setMovie(movieRes.data);

        const trailers = videosRes.data.results.filter(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailers.length > 0) {
          setTrailerKey(trailers[0].key);
        } else {
          setTrailerKey(null);
        }

        try {
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=77c3d65c6bcbe51c765e30b4b27f6521&language=tr-TR`
          );
          setCast(creditsRes.data.cast || []);
        } catch (err) {
          console.error("Oyuncular alınamadı:", err);
        }
      } catch (err) {
        console.error("Detay alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    setComments([
      { user: "Ali", text: "Çok beğendim!", stars: 5 },
      { user: "Ayşe", text: "Biraz sıkıcıydı.", stars: 3 },
      { user: "Zeynep", text: "Oyunculuklar müthişti!", stars: 4 },
      {
        user: "Burak",
        text: "Görsel efektler zayıf ama hikaye sürükleyici.",
        stars: 4,
      },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "" || rating === 0) return;

    const newComment = {
      user: "Sen",
      text: commentText,
      stars: rating,
    };

    setComments([...comments, newComment]);
    setCommentText("");
    setRating(0);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: "100%", margin: "auto", px: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
            gap: 4,
          }}
        >
          <Card sx={{ boxShadow: 3, height: 450 }}>
            <CardMedia
              component="img"
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              sx={{ width: 300, height: "100%", objectFit: "cover" }}
            />
          </Card>

          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#111", fontWeight: 600 }}
            >
              {movie.title} ({movie.release_date?.slice(0, 4)})
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, color: "#333" }}>
              {movie.overview || "Açıklama bulunamadı!"}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                cursor: trailerKey ? "pointer" : "default",
                color: trailerKey ? "#1976d2" : "gray",
                fontWeight: 500,
                mt: 2,
              }}
              onClick={() => {
                if (trailerKey) {
                  window.open(
                    `https://www.youtube.com/watch?v=${trailerKey}`,
                    "_blank"
                  );
                }
              }}
            >
              <span style={{ fontSize: 20 }}>&#9654;</span>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Fragmanı Oynat
              </Typography>
            </Box>

            {movie.genres?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#555" }}
                >
                  Türler
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {movie.genres.map((genre) => (
                    <Box
                      key={genre.id}
                      sx={{
                        backgroundColor: "#e0e0e0",
                        px: 2,
                        py: 0.5,
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        color: "#333",
                      }}
                    >
                      {genre.name}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                color: "#00aaff",
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              IMDb Puanı: {movie.vote_average?.toFixed(1)} / 10
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#555" }}>
                <strong>Orijinal Ad:</strong> {movie.original_title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                <strong>Çıkış Tarihi:</strong> {movie.release_date}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                <strong>Dil:</strong> {movie.original_language?.toUpperCase()}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                <strong>Yetişkin Filmi:</strong>{" "}
                {movie.adult ? "Evet" : "Hayır"}
              </Typography>
            </Box>

            {cast.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#555" }}
                >
                  Oyuncular
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    py: 1,
                    paddingBottom: 1,
                  }}
                >
                  {cast.slice(0, 10).map((actor) => (
                    <Box
                      key={actor.cast_id || actor.credit_id}
                      sx={{ minWidth: 100, textAlign: "center" }}
                    >
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://via.placeholder.com/100x150?text=No+Image"
                        }
                        alt={actor.name}
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontWeight: 500, color: "#222" }}
                        noWrap
                      >
                        {actor.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#666" }}
                        noWrap
                      >
                        {actor.character}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#222", fontWeight: 600 }}
        >
          Kullanıcı Yorumları
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {comments.map((c, i) => (
            <Paper key={i} elevation={1} sx={{ p: 2 }}>
              <Typography sx={{ color: "#000", fontWeight: 500 }}>
                {c.user}
              </Typography>
              <Rating value={c.stars} readOnly size="small" />
              <Typography sx={{ color: "#444", mt: 1 }}>{c.text}</Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#111", fontWeight: 600 }}
          >
            Yorum Yap
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: "#666" }}>
            Fikirlerini diğer izleyicilerle paylaş:
          </Typography>

          <form onSubmit={handleSubmit}>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Yorumunuzu yazın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#1976d2" }}
            >
              Gönder
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default MovieDetails;
