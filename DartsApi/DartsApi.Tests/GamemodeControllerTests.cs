using DartsApi.Data;
using DartsApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DartsApi.Controller
{
    public class GamemodeControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "GamemodeDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Gamemodes.RemoveRange(context.Gamemodes);
            context.Gamemodes.AddRange(new List<Gamemode>
            {
                new Gamemode {Id = 1, Name = "501"},
                new Gamemode {Id = 2, Name = "301"},
            });
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetGamemodes_ReturnsListOfGamemodes()
        {
            var context = GetInMemoryDbContext();
            var controller = new GamemodeController(context);

            var result = await controller.GetGamemodes();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var checkouts = Assert.IsAssignableFrom<IEnumerable<Gamemode>>(okResult.Value);
            Assert.Equal(2, checkouts.Count());
        }
    }
}
