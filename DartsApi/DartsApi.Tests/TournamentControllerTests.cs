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
    public class TournamentControllerTests
    {
        private AppDbContext getInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TournamentDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var favoriteGame = new Gamemode { Id = 1, Name = "501" };
            var user = new User { Id = 1, Name = "Alice", Email = "alice@example.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };
            var tournament = new Tournament
            {
                Id = 1,
                Winner = null,
                Datum = DateTime.UtcNow,
            };
            context.Gamemodes.Add(favoriteGame);
            context.Users.Add(user);
            context.Tournaments.Add(tournament);

            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetTournaments_ReturnsTournamentList()
        {
            var context = getInMemoryDbContext();
            var controller = new TournamentController(context);

            var result = await controller.GetTournaments();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var tournaments = Assert.IsAssignableFrom<IEnumerable<Tournament>>(okResult.Value);
            Assert.Single(tournaments);
        }

        [Fact]
        public async Task CreateTournament_returnsCreatedMatch()
        {
            var context = getInMemoryDbContext();
            var controller = new TournamentController(context);

            var tournament = new Tournament
            {
                Winner = null,
                Datum = DateTime.UtcNow,
            };

            ActionResult<IEnumerable<Tournament>> result = await controller.CreateTournament(tournament);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdTournament = Assert.IsType<Tournament>(createdResult.Value);

            Assert.Equal(tournament.Datum, createdTournament.Datum);
        }

        [Fact]
        public async Task setWinner_UpdatesWinnerAndRetunrsNoContent()
        {
            var context = getInMemoryDbContext();
            var controller = new TournamentController(context);

            var updateDto = new TournamentUpdateDto
            {
                Id = 1,
                WinnerId = 1,
                Datum = DateTime.UtcNow
            };

            var result = await controller.SetTournamentWinner(1, updateDto);

            Assert.IsType<NoContentResult>(result);

            var updatedTorunament = await context.Tournaments.Include(m => m.Winner).FirstOrDefaultAsync(m => m.Id == 1);
            
            Assert.NotNull(updatedTorunament.Winner);
            Assert.Equal(1, updatedTorunament.Winner.Id);
        }

    }
}
