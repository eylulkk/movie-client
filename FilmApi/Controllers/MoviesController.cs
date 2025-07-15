using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace FilmApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class MoviesController : ControllerBase
	{
		private readonly HttpClient _httpClient;
		private const string ApiKey = "77c3d65c6bcbe51c765e30b4b27f6521";

		public MoviesController(IHttpClientFactory httpClientFactory)
		{
			_httpClient = httpClientFactory.CreateClient();
		}

		private static Dictionary<int, List<(int Score, string Note)>> _ratings = new();

		[HttpGet("list")]
		public async Task<IActionResult> GetMovies([FromQuery] string? query, [FromQuery] int page = 1)
		{
			string url = string.IsNullOrWhiteSpace(query)
				? $"https://api.themoviedb.org/3/movie/popular?api_key={ApiKey}&language=tr-TR&page={page}"
				: $"https://api.themoviedb.org/3/search/movie?api_key={ApiKey}&language=tr-TR&page={page}&query={query}";

			var response = await _httpClient.GetAsync(url);
			if (!response.IsSuccessStatusCode)
				return StatusCode((int)response.StatusCode, "TMDB'den veri alınamadı.");

			var content = await response.Content.ReadAsStringAsync();
			return Content(content, "application/json");
		}

		[HttpPost("{id}/rating")]
		public IActionResult AddRating(int id, [FromBody] RatingRequest request)
		{
			if (request.Score < 1 || request.Score > 10)
				return BadRequest("Puan 1 ile 5 arasında olmalı.");

			if (!_ratings.ContainsKey(id))
				_ratings[id] = new List<(int, string)>();

			_ratings[id].Add((request.Score, request.Note ?? ""));

			return Ok(new { message = "Puan ve not başarıyla eklendi." });
		}


		[HttpGet("{id}")]
		public async Task<IActionResult> GetMovieDetail(int id)
		{
			string url = $"https://api.themoviedb.org/3/movie/{id}?api_key={ApiKey}&language=tr-TR";
			var response = await _httpClient.GetAsync(url);

			if (!response.IsSuccessStatusCode)
				return StatusCode((int)response.StatusCode, "TMDB'den film detayı alınamadı.");

			var movieJson = await response.Content.ReadAsStringAsync();

			_ratings.TryGetValue(id, out var ratingsForMovie);
			double avgScore = ratingsForMovie?.Count > 0 ? ratingsForMovie.Average(r => r.Score) : 0;

			var result = new
			{
				movie = movieJson,
				averageScore = avgScore,
				notes = ratingsForMovie ?? new List<(int score, string note)>()
			};

			return Ok(result);
		}
	}

	public class RatingRequest
	{
		public int Score { get; set; }
		public string? Note { get; set; }
	}
}
