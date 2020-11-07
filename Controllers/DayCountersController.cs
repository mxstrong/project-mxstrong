using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mxstrong.Dtos;
using Mxstrong.Models;

namespace Mxstrong.Controllers
{
    [Route("api/goals/[controller]")]
    [ApiController]
    public class DayCountersController : ControllerBase
    {
        private readonly MxstrongContext _context;

        public DayCountersController(MxstrongContext context)
        {
          _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DayCounterDto>>> GetDayCounters()
        {
          return await _context.DayCounters.Select(counter => new DayCounterDto { 
            GoalId = counter.GoalId,
            Text = counter.Text,
            ParentGoalId = counter.ParentGoalId,
            StartingDate = counter.StartingDate.ToString("yyyy-MM-dd"),
            DayGoal = counter.DayGoal,
          }).ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDayCounter(string id, EditDayCounterDto dayCounter)
        {
          if (id != dayCounter.GoalId)
          {
            return BadRequest();
          }

          var existingCounter = await _context.DayCounters.FindAsync(id);

          existingCounter.Text = dayCounter.Text;
          existingCounter.StartingDate = dayCounter.StartingDate;
          existingCounter.DayGoal = dayCounter.DayGoal;
          existingCounter.UpdatedAt = DateTime.Now;

          try
          {
            await _context.SaveChangesAsync();
          }
          catch (DbUpdateConcurrencyException)
          {
            if (!DayCounterExists(id))
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
        public async Task<ActionResult<DayCounter>> PostDayCounter(AddDayCounterDto dayCounter)
        {
          var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
          var newCounter = new DayCounter
          {
            GoalId = Guid.NewGuid().ToString(),
            Text = dayCounter.Text,
            StartingDate = dayCounter.StartingDate,
            DayGoal = int.Parse(dayCounter.DayGoal),
            UserId = userId,
            ParentGoalId = dayCounter.ParentGoalId,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
          };
          _context.DayCounters.Add(newCounter);
          try
          {
            await _context.SaveChangesAsync();
          }
          catch (DbUpdateException)
          {
            if (DayCounterExists(newCounter.GoalId))
            {
              return Conflict();
            }
            else
            {
              throw;
            }
          }

          return CreatedAtAction("GetDayCounter", new { id = newCounter.GoalId }, newCounter);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<DayCounter>> DeleteDayCounter(string id)
        {
          var dayCounter = await _context.DayCounters.FindAsync(id);
          if (dayCounter == null)
          {
             return NotFound();
          }

          _context.DayCounters.Remove(dayCounter);
          await _context.SaveChangesAsync();

          return dayCounter;
        }

        private bool DayCounterExists(string id)
        {
          return _context.DayCounters.Any(e => e.GoalId == id);
        }
    }
}
