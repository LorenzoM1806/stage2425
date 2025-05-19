using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DartsApi.Controller
{
    public class ThrowControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "ThrowDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var favoriteGame = new Gamemode { Id = 1, Name = "301" };
            var player1 = new User { Id = 1, Name = "Lorenzo", Email = "lm@hotmail.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };
            var player2 = new User { Id = 2, Name = "Jef", Email = "jef@hotmail.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };
            var match = new Match { Id = 1, Player1 = player1, Player2 = player2, Gamemode = favoriteGame, Winner = null, Datum = DateTime.UtcNow, Finished = false };

            var gooi = new Throw
            {
                Id = 1,
                Match = match,
                Throw1 = 60,
                Throw2 = 60,
                Throw3 = 60,
                Speler = player1,
                Datum = DateTime.UtcNow,
            };

            context.Users.AddRange(player1, player2);
            context.Gamemodes.Add(favoriteGame);
            context.Matches.Add(match);
            context.Throws.Add(gooi);

            context.SaveChanges();

            return context;

        }

        [Fact]
        public async Task GetThrows_ReturnsThrowList()
        {
            var context = GetInMemoryDbContext();
            var controller = new ThrowController(context);

            var result = await controller.GetThrows();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var throws = Assert.IsAssignableFrom<IEnumerable<Throw>>(okResult.Value);
            Assert.Single(throws);
        }

        [Fact]
        public async Task CreateThrow_retunrsCreatedthrow()
        {
            var context = GetInMemoryDbContext();
            var controller = new ThrowController(context);

            var throwDto = new ThrowDto
            {
                MatchId = 1,
                Throw1 = 50,
                Throw2 = 50,
                Throw3 = 50,
                SpelerId = 2,
                Datum = DateTime.UtcNow,
            };

            ActionResult<IEnumerable<Throw>> result = await controller.RegisterThrow(throwDto);

            var createdresult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdThrow = Assert.IsType<Throw>(createdresult.Value);

            Assert.Equal(throwDto.MatchId, createdThrow.Match.Id);
            Assert.Equal(throwDto.SpelerId, createdThrow.Speler.Id);
        }
    }
}
