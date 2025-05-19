using DartsApi.Data;
using DartsApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[Controller]")]
    [ApiController]
    public class GamemodeController: ControllerBase
    {
        private readonly AppDbContext _context; 

        public GamemodeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gamemode>>> GetGamemodes()
        {
            try
            {
                var gamemodes = await _context.Gamemodes.ToListAsync();
                if (gamemodes.Count > 0)
                {
                    return Ok(gamemodes);
                }
                return NotFound($"There are no gamemodes found.");
            }
            catch (Exception ex) { 
                return StatusCode(500, ex.Message);
            }
        }
    }
}
