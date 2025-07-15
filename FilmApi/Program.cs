using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
	options.AddPolicy(name: MyAllowSpecificOrigins,
					  policy =>
					  {
						  policy.WithOrigins("http://localhost:5173")
								.AllowAnyHeader()
								.AllowAnyMethod();
					  });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();


var jwtKey = builder.Configuration["Jwt:Key"]
			 ?? throw new InvalidOperationException("Jwt:Key deðeri appsettings.json içinde tanýmlý deðil!");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
			 ?? throw new InvalidOperationException("Jwt:Issuer deðeri appsettings.json içinde tanýmlý deðil!");

var jwtAudience = builder.Configuration["Jwt:Audience"]
			 ?? throw new InvalidOperationException("Jwt:Audience deðeri appsettings.json içinde tanýmlý deðil!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = jwtIssuer,
			ValidAudience = jwtAudience,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
		};
	});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}


app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
