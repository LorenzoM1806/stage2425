using DartsApi.Data;
using DartsApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController: ControllerBase
    {
        private readonly AppDbContext _context;

        public CheckoutController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Checkout>>> GetCheckouts()
        {

            try
            {
                return await _context.Checkouts.ToListAsync();
            }
            catch (Exception ex)
            {
               return StatusCode(500, ex.Message);
            }

            
        }
    }
}
