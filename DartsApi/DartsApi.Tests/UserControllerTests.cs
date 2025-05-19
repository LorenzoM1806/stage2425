using DartsApi.Data;
using DartsApi.Models;
using DartsApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DartsApi.Controller
{
    public class UserControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "UserDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var favoriteGame = new Gamemode { Id = 1, Name = "501" };
            var user = new User
            {
                Id = 1,
                Name = "Lorenzo",
                Email = "lorenzo@hotmail.com",
                FavoriteGame = favoriteGame,
                Role = "Admin",
                IsDeleted = false,
            };
            context.Gamemodes.Add(favoriteGame);
            context.Users.Add(user);

            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetUsers_ReturnsUserList()
        {
            var context = GetInMemoryDbContext();
            var controller = new UserController(context);

            var result = await controller.GetUsers();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var users = Assert.IsAssignableFrom<IEnumerable<User>>(okResult.Value);
            Assert.Single(users);
        }

        [Fact]
        public async Task GetUserById_ReturnsUser()
        {
            var context = GetInMemoryDbContext();
            var controller = new UserController(context);

            var result = await controller.GetUserById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var user = Assert.IsAssignableFrom<User>(okResult.Value);
            Assert.Equal(expected: 1, actual: user.Id);
        }

        [Fact]
        public async Task UpdateUser_UpdatesUserAndreturnsNoContent()
        {
            var context = GetInMemoryDbContext();
            var controller = new UserController(context);

            var updateDto = new UserUpdateDto
            {
                Id = 1,
                Name = "Lorenzo",
                Email = "lorenzo@hotmail.com",
                FavoriteGameId = 1,
                Role = "User",
                IsDeleted = false,
            };

            var result = await controller.UpdateUser(1, updateDto);

            Assert.IsType<NoContentResult>(result);

            var updatedUser = await context.Users.FirstOrDefaultAsync(m => m.Id == 1);
            Assert.NotNull(updatedUser.Role);
            Assert.Equal("User", updatedUser.Role);
        }
    }
}
