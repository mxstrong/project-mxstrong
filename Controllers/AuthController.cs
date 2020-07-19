using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mxstrong.Data;
using Mxstrong.Dtos;
using Mxstrong.Models;
using Mxstrong.Services;
using SQLitePCL;

namespace Mxstrong.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _repo;
    private readonly IConfiguration _config;
    private readonly IEmailSender _sender;

    public AuthController(IAuthRepository repo, IConfiguration config, IEmailSender sender)
    {
      _repo = repo;
      _config = config;
      _sender = sender;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
    { 
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      if (await _repo.UserExists(registerUserDto.Email))
      {
        return BadRequest("Email is already taken");
      }
        

      var userToCreate = new User
      {
        Email = registerUserDto.Email,
        FullName = registerUserDto.FullName,
        Activated = false
      };

      var createdUser = await _repo.Register(userToCreate, registerUserDto.Password);

      var token = await _repo.GenerateActivationToken(createdUser.UserId);

      await _sender.SendActivationEmail(createdUser, token);

      return StatusCode(201);
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDto registerUserDto)
    {
      var userFromRepo = await _repo.Login(registerUserDto.Email, registerUserDto.Password);
      if (userFromRepo == null)
      {
        return Unauthorized();
      }
      if (!userFromRepo.Activated)
      {
        return BadRequest("You need to activate your account to proceed");
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

    [HttpGet("{tokenId}")]
    public async Task<IActionResult> Activate(string tokenId)
    {
      var user = await _repo.ActivateUser(tokenId);
      if (user.Activated)
      {
        return Redirect("https://localhost:5001/login");
      }
      return BadRequest("Wrong activation token");
    }

    [HttpPost]
    public async Task<IActionResult> EmailTaken(string email)
    {
      if (await _repo.UserExists(email))
      {
        return BadRequest("Email is already taken");
      }
      return Ok();
    }
    [HttpGet]
    public async Task<IActionResult> CurrentUser()
    {
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var user = await _repo.FindUser(userId);
      var profile = new UserProfileDto
      {
        UserId = user.UserId,
        FullName = user.FullName,
        Email = user.Email
      };
      return Ok(profile);
    }
  }
}