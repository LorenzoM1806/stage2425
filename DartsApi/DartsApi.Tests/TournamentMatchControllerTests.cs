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
    public class TournamentMatchControllerTests
    {
        private AppDbContext GetInMemoryDbcontext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TournamentMatchDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var tournament = new Tournament { Id = 1, Winner = null, Datum = DateTime.UtcNow };
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

            var tournamentMatch = new TournamentMatch
            {
                Id = 1,
                Tournament = tournament,
                Match = match,
                Round = "1"
            };

            context.Tournaments.Add(tournament);
            context.Users.AddRange(player1, player2);
            context.Gamemodes.Add(favoriteGame);
            context.Matches.Add(match);
            context.TournamentMatches.Add(tournamentMatch);
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetTournamentMatches_ReturnsTournamentMatchList()
        {
            var context = GetInMemoryDbcontext();
            var controller = new TournamentMatchController(context);

            var result = await controller.GetTournamentMatches();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var matches = Assert.IsAssignableFrom<IEnumerable<TournamentMatch>>(okResult.Value);
            Assert.Single(matches);
        }

        [Fact]
        public async Task CreateTournamentMatch_returnsCreatedTournamentMatch()
        {
            var context = GetInMemoryDbcontext();
            var controller = new TournamentMatchController(context);

            var tournamentMatchDto = new TournamentMatchDto
            {
                TournamentId = 1,
                MatchId = 1,
                Round = "Finale"
            };

            ActionResult<IEnumerable<TournamentMatch>> result = await controller.CreateNextRound(tournamentMatchDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdTM = Assert.IsType<TournamentMatch>(createdResult.Value);

            Assert.Equal(tournamentMatchDto.TournamentId, createdTM.Tournament.Id);
            Assert.Equal(tournamentMatchDto.MatchId, createdTM.Match.Id);
        }
    }
}
