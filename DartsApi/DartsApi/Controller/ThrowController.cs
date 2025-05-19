using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThrowController: ControllerBase
    {
        private readonly AppDbContext _context;

        public ThrowController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Throw>>> GetThrows()
        {
            try
            {
                var throws = await _context.Throws
                    .Include(t => t.Match)
                    .Include(t => t.Speler)
                        .ThenInclude(p => p.FavoriteGame)
                    .ToListAsync();

                if (throws.Count > 0) {
                    return Ok(throws);
                }
                return NotFound("There are no throws found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Throw>>> RegisterThrow([FromBody] ThrowDto dto)
        {
            if (dto == null)
            {
                return BadRequest("No Throw provided");
            }

            try
            {
                var match = await _context.Matches.FindAsync(dto.MatchId);
                var player = await _context.Users.FindAsync(dto.SpelerId);

                if(match == null || player == null)
                {
                    return BadRequest("One or more required entities not found.");
                }

                var gooi = new Throw
                {
                    Match = match,
                    Throw1 = dto.Throw1,
                    Throw2 = dto.Throw2,
                    Throw3 = dto.Throw3,
                    Speler = player,
                    Datum = dto.Datum
                };

                _context.Throws.Add(gooi);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetThrows), gooi);
            }
            catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
