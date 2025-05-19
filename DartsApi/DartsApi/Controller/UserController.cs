using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.FavoriteGame)
                    .ToListAsync();

                if (users.Count > 0)
                {
                    return Ok(users);
                }
                return NotFound($"There are no users found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("User id mismatch");
            }

            var oldUser = await _context.Users.FindAsync(id);
            if (oldUser == null)
            {
                return NotFound("User not found");
            }

            var gamemode = await _context.Gamemodes.FindAsync(dto.FavoriteGameId);
            if (gamemode == null)
            {
                return BadRequest("Entity gamemode not found");
            }

            oldUser.Name = dto.Name;
            oldUser.Email = dto.Email;
            oldUser.FavoriteGame = gamemode;
            oldUser.Role = dto.Role;
            oldUser.IsDeleted = dto.IsDeleted;

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
