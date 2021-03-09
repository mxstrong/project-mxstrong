using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Data;
using Mxstrong.Dtos;
using Mxstrong.Models;

namespace Mxstrong.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class CommentsController : ControllerBase
  {
    private readonly MxstrongContext _context;
    private readonly IAuthRepository _authRepo;

    public CommentsController(MxstrongContext context, IAuthRepository authRepo)
    {
      _context = context;
      _authRepo = authRepo;
    }
    
    [AllowAnonymous]
    [HttpGet("{postId}")]
    public async Task<ActionResult<List<CommentDto>>> GetPostsComments(string postId)
    {
      var comments = await _context.Comments.Where(c => c.PostId == postId).Include(c => c.User).ToListAsync();
      if (comments == null)
      {
        return NotFound();
      }
      var commentDtos = comments.Select(c => ConvertCommentToDto(c)).ToList();
      return commentDtos;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutComment(string id, EditCommentDto comment)
    {
      if (id != comment.CommentId)
      {
          return BadRequest();
      }

      var currentUserId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
      var currentUser = await _authRepo.FindUser(currentUserId);

      var existingComment = await _context.Comments.FindAsync(id);

      if (currentUserId != existingComment.UserId && currentUser.Role != Role.Admin)
      {
        return Unauthorized();
      }

      existingComment.Text = comment.Text;
      existingComment.UpdatedAt = DateTime.Now;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!CommentExists(id))
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

    [HttpPost]
    public async Task<ActionResult<Comment>> PostComment(AddCommentDto comment)
    {
      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

      var newComment = new Comment()
      {
        CommentId = Guid.NewGuid().ToString(),
        Text = comment.Text,
        ParentId = comment.ParentId,
        PostId = comment.PostId,
        UserId = userId,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now
      };

      _context.Comments.Add(newComment);
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (CommentExists(newComment.CommentId))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }

      return CreatedAtAction("GetComment", new { id = newComment.CommentId }, newComment);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Comment>> DeleteComment(string id)
    {

      var comment = await _context.Comments.FindAsync(id);
      if (comment == null)
      {
        return NotFound();
      }

      var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

      if (userId != comment.UserId && comment.User.Role != Role.Admin)
      {
        return Unauthorized();
      }

      _context.Comments.Remove(comment);
      await _context.SaveChangesAsync();

      return comment;
    }

    private bool CommentExists(string id)
    {
      return _context.Comments.Any(e => e.CommentId == id);
    }

    private static CommentDto ConvertCommentToDto(Comment comment) {
      return new CommentDto() {
        CommentId = comment.CommentId,
        Text = comment.Text,
        CreatedAt = comment.CreatedAt.ToString("yyyy-MM-dd"),
        Children = comment.Children?.Select(c => ConvertCommentToDto(c)).ToList(),
        PostId = comment.PostId,
        UserId = comment.UserId,
        Author = comment.User.FullName,
        ParentId = comment.ParentId,
      };
    }
  }
}
