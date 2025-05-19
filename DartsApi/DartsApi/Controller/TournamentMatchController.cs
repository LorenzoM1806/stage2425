using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentMatchController: ControllerBase
    {
        private readonly AppDbContext _context;

        public TournamentMatchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TournamentMatch>>> GetTournamentMatches()
        {
            try
            {
                var matches = await _context.TournamentMatches
                    .Include(tm => tm.Tournament)
                        .ThenInclude(t => t.Winner)
                    .Include(tm => tm.Match)
                        .ThenInclude(m => m.Player1)
                        .ThenInclude(p => p.FavoriteGame)
                    .Include(tm => tm.Match)
                        .ThenInclude(m => m.Player2)
                        .ThenInclude(p => p.FavoriteGame)
                    .Include(tm => tm.Match)
                        .ThenInclude(m => m.Gamemode)
                    .Include(tm => tm.Match)
                        .ThenInclude(m => m.Winner)
                    .ToListAsync();

                if(matches.Count > 0)
                {
                    return Ok(matches);
                }
                return NotFound("There are no matches for tournament");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<TournamentMatch>>> CreateNextRound([FromBody] TournamentMatchDto dto)
        {
            if(dto == null)
            {
                return BadRequest("No Tournament Matches provided");
            }

            try
            {
                var tournament = await _context.Tournaments.FindAsync(dto.TournamentId);
                var match = await _context.Matches.FindAsync(dto.MatchId);

                if (tournament == null || match == null)
                {
                    return BadRequest("One or more required entities not found.");
                }

                var tournMatch = new TournamentMatch
                {
                    Tournament = tournament,
                    Match = match,
                    Round = dto.Round
                };

                _context.TournamentMatches.Add(tournMatch);

                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTournamentMatches), tournMatch);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
