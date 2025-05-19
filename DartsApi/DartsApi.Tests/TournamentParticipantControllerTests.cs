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
    public class TournamentParticipantControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TournamentParticipant_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var favoriteGame = new Gamemode { Id = 1, Name = "301" };
            var tournament = new Tournament { Id = 1, Winner = null, Datum = DateTime.UtcNow };
            var participant = new User { Id = 1, Name = "Lorenzo", Email = "lm@hotmail.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };
            var participant2 = new User { Id = 2, Name = "Jef", Email = "jef@hotmail.com", FavoriteGame = favoriteGame, Role = "User", IsDeleted = false };
            
            var tournamentParticipant = new TournamentParticipant
            {
                Id = 1,
                Tournament = tournament,
                Player = participant,
            };

            context.Gamemodes.Add(favoriteGame);
            context.Tournaments.Add(tournament);
            context.Users.AddRange(participant, participant2);
            context.TournamentParticipants.Add(tournamentParticipant);

            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetTournamentParticipants_ReturnsTournamentParticipantList()
        {
            var context = GetInMemoryDbContext();
            var controller = new TournamentParticipantController(context);

            var result = await controller.GetAllParticipants();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var tp = Assert.IsAssignableFrom<IEnumerable<TournamentParticipant>>(okResult.Value);
            Assert.Single(tp);
        }

        [Fact]
        public async Task AddTournamentParticipant_returnsCreatedTournamentParticipant()
        {
            var context = GetInMemoryDbContext();
            var controller = new TournamentParticipantController(context);

            var tournamentParticipantDto = new TorunamentParticipantDto
            {
                TournamentId = 1,
                PlayerId = 2,   
            };

            ActionResult<IEnumerable<TournamentParticipant>> result = await controller.addTournamentParticipant(tournamentParticipantDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdTP = Assert.IsType<TournamentParticipant>(createdResult.Value);

            Assert.Equal(tournamentParticipantDto.TournamentId, createdTP.Tournament.Id);
            Assert.Equal(tournamentParticipantDto.PlayerId, createdTP.Player.Id);
        }

    }
}
