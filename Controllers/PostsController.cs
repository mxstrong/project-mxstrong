using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Dtos;
using Mxstrong.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Mxstrong.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class PostsController : ControllerBase
  {
    private readonly MxstrongContext _context;

    public PostsController(MxstrongContext context)
    {
      _context = context;
    }

    // GET: api/Posts
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<PostDto>>> GetPosts()
    {
      return await _context.Posts.Select(post => new PostDto()
      {
        PostId = post.PostId,
        Title = post.Title,
        Body = new string(post.Body.Take(100).ToArray()),
        Topic = post.Topic.Name,
        UserId = post.UserId,
        Author = post.User.FullName,
        CreatedAt = post.CreatedAt.ToString("yyyy-MM-dd"),
      }).ToListAsync();
    }

    // GET: api/Posts/5
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPost(string id)
    {
      var postDto = await _context.Posts.Select(post => new PostDto()
      {
        PostId = post.PostId,
        Title = post.Title,
        Body = post.Body,
        Topic = post.Topic.Name,
        UserId = post.UserId,
        Author = post.User.FullName,
        CreatedAt = post.CreatedAt.ToString("yyyy-MM-dd"),
      }).SingleOrDefaultAsync(post => post.PostId == id);

      if (postDto == null)
      {
        return NotFound();
      }

      return Ok(postDto);
    }

    // PUT: api/Posts/5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPost(string id, EditPostDto updatedPost)
    {
      if (id != updatedPost.PostId)
      {
        return BadRequest();
      }
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var post = await _context.Posts.FindAsync(id);

      if (userId != post.UserId && post.User.Role != Role.Admin)
      {
        return Unauthorized();
      }

      var topic = await _context.Topics.FirstAsync(topic => topic.Name == updatedPost.Topic);
      post.Title = updatedPost.Title;
      post.TopicId = topic.TopicId;
      post.Body = updatedPost.Body;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!PostExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Posts
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    public async Task<ActionResult<PostDto>> PostPost(AddPostDto post)
    {
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var topic = await _context.Topics.FirstOrDefaultAsync(topic => topic.Name == post.Topic);
      var newPost = new Post()
      {
        PostId = Guid.NewGuid().ToString(),
        Title = post.Title,
        Body = post.Body,
        TopicId = topic.TopicId,
        UserId = userId,
        CreatedAt = DateTime.Now,
      };
      _context.Posts.Add(newPost);

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (PostExists(newPost.PostId))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }

      var postDto = new PostDto()
      {
        PostId = newPost.PostId,
        Title = newPost.Title,
        Body = newPost.Body,
        Topic = newPost.Topic.Name,
        UserId = newPost.UserId,
        Author = newPost.User.FullName,
        CreatedAt = newPost.CreatedAt.ToString("yyyy-MM-dd"),
      };

      return CreatedAtAction("GetPost", postDto);
    }

    // DELETE: api/Posts/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Post>> DeletePost(string id)
    {
      
      var post = await _context.Posts.FindAsync(id);
      if (post == null)
      {
        return NotFound();
      }

      if (HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) != post.UserId && post.User.Role != Role.Admin)
      {
        return Unauthorized();
      }

      _context.Posts.Remove(post);
      await _context.SaveChangesAsync();

      return post;
    }

    private bool PostExists(string id)
    {
      return _context.Posts.Any(e => e.PostId == id);
    }
  }
}
