using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MovieApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
	private readonly IConfiguration _configuration;

	public AuthController(IConfiguration configuration)
	{
		_configuration = configuration;
	}


	private static List<User> users = new()
	{
		new User { Username = "user1", Password = "123456", Role = "film" , email="user1@gmail.com"},
		new User { Username = "user2", Password = "123456", Role = "oyuncu", email="user2@gmail.com" },
		new User { Username = "user3", Password = "123456", Role = "admin", email="user3@gmail.com" }
	};

	[HttpPost("login")]
	public IActionResult Login([FromBody] LoginRequest request)
	{
		Console.WriteLine($"[GELEN] Username: '{request.Username}', Password: '{request.Password}'");

		if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
		{
			return BadRequest(new { message = "Kullanıcı adı veya şifre boş!" });
		}

		var user = users.FirstOrDefault(u =>
			u.Username == request.Username && u.Password == request.Password);

		if (user == null)
		{
			Console.WriteLine("[uyarı] Kullanıcı bulunamadı.");
			return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı!" });
		}

		var token = GenerateJwtToken(user);

		Console.WriteLine($"[başarılı] Giriş yapan: {user.Username}, Rolü: {user.Role}");

		return Ok(new
		{
			token,
			username = user.Username,
			role = user.Role
		});
	}


	private string GenerateJwtToken(User user)
	{
		var claims = new[]
		{
			new Claim(ClaimTypes.Name, user.Username),
			new Claim(ClaimTypes.Role, user.Role)
		};


		var keyString = _configuration["Jwt:Key"]
	   ?? throw new InvalidOperationException("Jwt:Key değeri appsettings.json içinde tanımlı değil!");

		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			issuer: _configuration["Jwt:Issuer"],
			audience: _configuration["Jwt:Audience"],
			claims: claims,
			expires: DateTime.Now.AddHours(1),
			signingCredentials: creds
		);

		return new JwtSecurityTokenHandler().WriteToken(token: token);
	}
}

public class User
{
	public string Username { get; set; } = "";
	public string Password { get; set; } = "";
	public string Role { get; set; } = "";
	public string email { get; set; } = "";
}

public class LoginRequest
{
	public string? Username { get; set; }
	public string? Password { get; set; }
}
