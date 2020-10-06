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
    [Route("api/goals/[controller]")]
    [ApiController]
    public class CheckBoxesController : ControllerBase
    {
      private readonly MxstrongContext _context;

      public CheckBoxesController(MxstrongContext context)
      {
        _context = context;
      }

      [HttpGet]
      public async Task<ActionResult<IEnumerable<CheckBoxDto>>> GetCheckBoxes()
      {
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var checkboxes = await _context.CheckBoxes.Where(pb => pb.UserId == userId).ToListAsync();
        var checkboxDtos = checkboxes.Select(checkbox => new CheckBoxDto
        {
          GoalId = checkbox.GoalId,
          Text = checkbox.Text,
          ParentGoalId = checkbox.ParentGoalId,
          Checked = checkbox.Checked
        }).ToList();
        return checkboxDtos;
      }

      [HttpPut("{id}")]
      public async Task<IActionResult> EditCheckBox(string id, EditGoalDto goalDto)
      {
        if (id != goalDto.GoalId)
        {
          return BadRequest();
        }

        var checkbox = await _context.CheckBoxes.FindAsync(id);

        checkbox.Text = goalDto.Text;
        checkbox.UpdatedAt = DateTime.Now;

        _context.Entry(checkbox).State = EntityState.Modified;

        try
        {
          await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
          if (!CheckBoxExists(id))
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
      public async Task<ActionResult<Goal>> AddCheckBox(AddGoalDto goalDto)
      {
        var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var checkBox = new CheckBox
        {
          GoalId = Guid.NewGuid().ToString(),
          Text = goalDto.Text,
          Checked = false,
          UserId = userId,
          ParentGoalId = goalDto.ParentGoalId,
          CreatedAt = DateTime.Now,
          UpdatedAt = DateTime.Now
        };

        _context.CheckBoxes.Add(checkBox);
        try
        {
          await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
          if (CheckBoxExists(checkBox.GoalId))
          {
            return Conflict();
          }
          else
          {
            throw;
          }
        }

        return CreatedAtAction("AddCheckBox", checkBox);
      }

      [HttpDelete("{id}")]
      public async Task<ActionResult<Goal>> DeleteCheckBox(string id)
      {
        var checkbox = await _context.CheckBoxes.FindAsync(id);
        if (checkbox == null)
        {
          return NotFound();
        }

        _context.CheckBoxes.Remove(checkbox);
        await _context.SaveChangesAsync();

        return checkbox;
      }

      private bool CheckBoxExists(string id)
      {
        return _context.CheckBoxes.Any(c => c.GoalId == id);
      }
  }
}