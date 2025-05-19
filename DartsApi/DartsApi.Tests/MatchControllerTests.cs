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
    public class MatchControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "MatchDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var favoriteGame = new Gamemode { Id = 1, Name = "301" };
            var player1 = new User { Id = 1, Name = "Lorenzo", Email = "lm@hotmail.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };
            var player2 = new User { Id = 2, Name = "Jef", Email = "jef@hotmail.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };

            var match = new Match
            {
                    Id = 1,
                    Player1 = player1,
                    Player2 = player2,
                    Gamemode = favoriteGame,
                    Winner = null,
                    Datum = DateTime.UtcNow,
                    Finished = false
            };
            context.Users.AddRange(player1, player2);
            context.Gamemodes.Add(favoriteGame);
            context.Matches.Add(match);
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetMatches_ReturnsMatchList()
        {
            var context = GetInMemoryDbContext();
            var controller = new MatchController(context);

            var result = await controller.GetMatches();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var matches = Assert.IsAssignableFrom<IEnumerable<Match>>(okResult.Value);
            Assert.Single(matches);
        }

        [Fact]
        public async Task CreateMatch_returnsCreatedMatch()
        {
            var context = GetInMemoryDbContext();
            var controller = new MatchController(context);

            var matchDto = new MatchDto
            {
                Player1Id = 1,
                Player2Id = 2,
                GamemodeId = 1,
                Datum = DateTime.UtcNow,
                Finished = false
            };

            ActionResult<IEnumerable<Match>> actionResult = await controller.CreateMatch(matchDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var createdMatch = Assert.IsType<Match>(createdResult.Value);

            Assert.Equal(matchDto.Player1Id, createdMatch.Player1.Id);
            Assert.Equal(matchDto.Player2Id, createdMatch.Player2.Id);
            Assert.Equal(matchDto.GamemodeId, createdMatch.Gamemode.Id);
        }

        [Fact]
        public async Task SetWinner_UpdatesMatchAndReturnsNoContent()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var controller = new MatchController(context);

            var updateDto = new MatchUpdateDto
            {
                Id = 1,
                Player1Id = 1,
                Player2Id = 2,
                GamemodeId = 1,
                WinnerId = 2,
                Datum = DateTime.UtcNow,
                Finished = true
            };

            // Act
            var result = await controller.SetWinner(1, updateDto);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var updatedMatch = await context.Matches.Include(m => m.Winner).FirstOrDefaultAsync(m => m.Id == 1);
            Assert.NotNull(updatedMatch.Winner);
            Assert.Equal(2, updatedMatch.Winner.Id);
        }

    }
}
