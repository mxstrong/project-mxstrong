using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Dtos;
using Mxstrong.Models;

namespace Mxstrong.Controllers
{
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
        [HttpGet]
        public async Task<ActionResult<List<PostDto>>> GetPosts()
        {
            return await _context.Posts.Select(post => new PostDto()
            {
                PostId = post.PostId,
                Title = post.Title,
                Body = post.Body,
                Topic = post.Topic.Name,
            }).ToListAsync();
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostDto>> GetPost(string id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            var postDto = new PostDto()
            {
                PostId = post.PostId,
                Title = post.Title,
                Body = post.Body,
                Topic = post.Topic.Name,
            };

            return postDto;
        }

        // PUT: api/Posts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(string id, Post post)
        {
            if (id != post.PostId)
            {
                return BadRequest();
            }

            _context.Entry(post).State = EntityState.Modified;

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
                UserId = userId
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
