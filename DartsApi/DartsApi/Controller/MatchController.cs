using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController: ControllerBase
    {
        private readonly AppDbContext _context;

        public MatchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            try
            {
                var matches = await _context.Matches
                    .Include(m => m.Player1)
                    .Include(m => m.Player2)
                    .Include(m => m.Gamemode)
                    .Include(m => m.Winner)
                    .ToListAsync();
                if (matches.Count > 0)
                {
                    return Ok(matches);
                }
                return NotFound($"There are no matches played");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Match>>> CreateMatch([FromBody] MatchDto matchDto)
        {
            if(matchDto == null)
            {
                return BadRequest("No Matches provided");
            }

            try
            {
                var player1 = await _context.Users.FindAsync(matchDto.Player1Id);
                var player2 = await _context.Users.FindAsync(matchDto.Player2Id);
                var gamemode = await _context.Gamemodes.FindAsync(matchDto.GamemodeId);

                if (player1 == null || player2 == null || gamemode == null)
                {
                    return BadRequest("One or more required entities not found.");
                }

                var match = new Match
                {
                    Player1 = player1,
                    Player2 = player2,
                    Gamemode = gamemode,
                    Winner = null, // Default to null
                    Datum = matchDto.Datum,
                    Finished = matchDto.Finished
                };

                _context.Matches.Add(match);

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMatches), match);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> SetWinner(int id, [FromBody] MatchUpdateDto dto)
        {
            if(id != dto.Id)
            {
                return BadRequest("Match id mismatch");
            }

            var oldMatch = await _context.Matches.FindAsync(id);
            if(oldMatch == null)
            {
                return NotFound("Match not found");
            }

            var player1 = await _context.Users.FindAsync(dto.Player1Id);
            var player2 = await _context.Users.FindAsync(dto.Player2Id);
            var gamemode = await _context.Gamemodes.FindAsync(dto.GamemodeId);
            var winner = await _context.Users.FindAsync(dto.WinnerId);

            if (player1 == null || player2 == null || gamemode == null)
            {
                return BadRequest("One or more related entities not found.");
            }

            oldMatch.Player1 = player1;
            oldMatch.Player2 = player2;
            oldMatch.Gamemode = gamemode;
            oldMatch.Winner = winner;
            oldMatch.Finished = dto.Finished;
            oldMatch.Datum = dto.Datum;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
