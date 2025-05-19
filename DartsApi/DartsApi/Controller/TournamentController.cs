using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TournamentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetTournaments()
        {
            try
            {
                var tournaments = await _context.Tournaments
                    .Include(t => t.Winner)
                        .ThenInclude(w => w.FavoriteGame)
                    .ToListAsync();

                if (tournaments.Count > 0)
                {
                    return Ok(tournaments);
                }
                return NotFound("There are no tournaments played");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Tournament>>> CreateTournament(Tournament tournament)
        {
            if (tournament == null)
            {
                return BadRequest("No Tournament provided");
            }

            try
            {
                _context.Tournaments.Add(tournament);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTournaments), tournament);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> SetTournamentWinner(int id, [FromBody] TournamentUpdateDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("Tournament id mismatch");
            }

            var oldTournament = await _context.Tournaments.FindAsync(id);
            if(oldTournament == null)
            {
                return NotFound("Tournament not found");
            }

            var winner = await _context.Users.FindAsync(dto.WinnerId);

            if (winner == null)
            {
                return BadRequest("Entity not found");
            }

            oldTournament.Winner = winner;
            oldTournament.Datum = dto.Datum;

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
