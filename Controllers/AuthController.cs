using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mxstrong.Data;
using Mxstrong.Dtos;
using Mxstrong.Models;
using Mxstrong.Services;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

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
        Activated = false,
        Role = Role.User,
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
          new Claim(ClaimTypes.Email, userFromRepo.Email),
          new Claim(ClaimTypes.Role, userFromRepo.Role)
        }),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
      };

      var token = tokenHandler.CreateToken(tokenDescriptor);
      var tokenString = tokenHandler.WriteToken(token);

      HttpContext.Response.Cookies.Append("JWT", tokenString, new CookieOptions { HttpOnly = true, Expires = DateTime.Now.AddDays(7) });
      return Ok();
    }

    [HttpPost]
    public IActionResult Logout()
    {
      HttpContext.Response.Cookies.Delete("JWT");
      return Ok();
    }

    [HttpGet("{tokenId}")]
    public async Task<IActionResult> Activate(string tokenId)
    {
      var user = await _repo.ActivateUser(tokenId);
      if (user.Activated)
      {
        return Redirect("https://mxstrong.azurewebsites.net/login");
      }
      return BadRequest("Wrong activation token");
    }

    [HttpPost]
    public async Task<IActionResult> EmailTaken(CheckEmailDto emailDto)
    {
      if (await _repo.UserExists(emailDto.Email))
      {
        return BadRequest("Email is already taken");
      }
      return Ok();
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> CurrentUser()
    {
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var user = await _repo.FindUser(userId);
      var profile = new UserProfileDto
      {
        UserId = user.UserId,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role,
      };
      return Ok(profile);
    }
    [Authorize(Roles = Role.Admin)]
    [HttpGet]
    public async Task<List<UserProfileDto>> Users()
    {
      var users = await _repo.GetUsers();
      return users.Select(user => new UserProfileDto
      {
        UserId = user.UserId,
        Email = user.Email,
        FullName = user.FullName,
        Role = user.Role
      }).ToList();
    }
    [Authorize(Roles = Role.Admin)]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, UserProfileDto user)
    {
      var updatedUser = await _repo.UpdateUser(id, user);
      if (updatedUser == null)
      {
        return BadRequest();
      }
      return NoContent();
    }
  }
}