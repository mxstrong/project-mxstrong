using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mxstrong.Data;
using Mxstrong.Dtos;
using Mxstrong.Models;

namespace Mxstrong.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _repo;
    private readonly IConfiguration _config;

    public AuthController(IAuthRepository repo, IConfiguration config)
    {
      _repo = repo;
      _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
    { 
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      if (await _repo.UserExists(registerUserDto.Email))
        return BadRequest("Email is already taken");

      var userToCreate = new User
      {
        Email = registerUserDto.Email
      };

      await _repo.Register(userToCreate, registerUserDto.Password);

      return StatusCode(201);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto registerUserDto)
    {
      var userFromRepo = await _repo.Login(registerUserDto.Email.ToLower(), registerUserDto.Password);
      if (userFromRepo == null)
      {
        return Unauthorized();
      }
        

      // generate token
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_config["JWTSecret"]);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new Claim[]{
          new Claim(ClaimTypes.NameIdentifier, userFromRepo.UserId),
          new Claim(ClaimTypes.Email, userFromRepo.Email)
        }),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      var tokenString = tokenHandler.WriteToken(token);

      return Ok(new { tokenString });
    }
  }
}