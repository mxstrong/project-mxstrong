using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Dtos;
using Mxstrong.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mxstrong.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class TopicsController : ControllerBase
  {
    private readonly MxstrongContext _context;

    public TopicsController(MxstrongContext context)
    {
      _context = context;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<TopicDto>>> GetTopics()
    {
      return await _context.Topics.Select(topic => new TopicDto()
      {
        TopicId = topic.TopicId,
        Name = topic.Name
      }).ToListAsync();
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<TopicDto>> GetTopic(string id)
    {
      var topic = await _context.Topics.FindAsync(id);

      if (topic == null)
      {
        return NotFound();
      }

      var topicDto = new TopicDto()
      {
        TopicId = topic.TopicId,
        Name = topic.Name
      };

      return Ok(topicDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutTopic(string id, Topic topic)
    {
      if (id != topic.TopicId)
      {
        return BadRequest();
      }

      topic.UpdatedAt = DateTime.Now;

      _context.Entry(topic).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!TopicExists(id))
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
    public async Task<ActionResult<Topic>> PostTopic(AddTopicDto topic)
    {
      var alreadyExists = _context.Topics.Any(t => t.Name == topic.Name);
      if (alreadyExists)
      {
        return BadRequest("This topic already exists");
      }

      var newTopic = new Topic()
      {
        TopicId = Guid.NewGuid().ToString(),
        Name = topic.Name,
        CreatedAt = DateTime.Now,
        UpdatedAt = DateTime.Now
      };

      _context.Topics.Add(newTopic);

      var topicDto = new TopicDto()
      {
        TopicId = newTopic.TopicId,
        Name = newTopic.Name
      };

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (TopicExists(newTopic.TopicId))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }

      return CreatedAtAction("GetTopic", topicDto);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Topic>> DeleteTopic(string id)
    {
      var topic = await _context.Topics.FindAsync(id);
      if (topic == null)
      {
        return NotFound();
      }

      _context.Topics.Remove(topic);
      await _context.SaveChangesAsync();

      return topic;
    }

    private bool TopicExists(string id)
    {
      return _context.Topics.Any(e => e.TopicId == id);
    }
  }
}
