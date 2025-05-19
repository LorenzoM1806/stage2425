using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    public class TournamentParticipantController: ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public TournamentParticipantController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TournamentParticipant>>> GetAllParticipants()
        {
            try
            {
                var participants = await _appDbContext.TournamentParticipants
                    .Include(tp => tp.Tournament)
                    .Include(tp => tp.Player)
                        .ThenInclude(p => p.FavoriteGame)
                    .ToListAsync();

                if(participants.Count > 0)
                {
                    return Ok(participants);
                }
                return NotFound("There are no participants found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<TournamentParticipant>>> addTournamentParticipant([FromBody] TorunamentParticipantDto dto)
        {
            if(dto == null)
            {
                return BadRequest("No tournamentParticipant provided");
            }

            try
            {
                var tournament = await _appDbContext.Tournaments.FindAsync(dto.TournamentId);
                var player = await _appDbContext.Users.FindAsync(dto.PlayerId);

                if(player == null || tournament == null)
                {
                    return BadRequest("One or more required entities not found.");
                }

                var tournParti = new TournamentParticipant
                {
                    Tournament = tournament,
                    Player = player
                };

                _appDbContext.TournamentParticipants.Add(tournParti);

                await _appDbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAllParticipants), tournParti);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
