using DartsApi.Controller;
using DartsApi.Data;
using DartsApi.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace DartsApi.testing
{
    public class CheckoutControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "CheckoutDb_Test")
                .Options;

            var context = new AppDbContext(options);

            context.Checkouts.RemoveRange(context.Checkouts);
            context.Checkouts.AddRange(new List<Checkout>
            {
                new Checkout {Id = 1, Score = 170, CheckoutPath = "T20 T20 Bull"},
                new Checkout {Id = 2, Score = 167, CheckoutPath = "T20 T19 Bull"},
            });
            context.SaveChanges();

            return context;
        }

        [Fact]
        public async Task GetCheckouts_ReturnsListOfCheckouts()
        {
            var context = GetInMemoryDbContext();
            var controller = new CheckoutController(context);

            var result = await controller.GetCheckouts();

            var okResult = Assert.IsType<ActionResult<IEnumerable<Checkout>>>(result);
            var checkouts = Assert.IsAssignableFrom<IEnumerable<Checkout>>(okResult.Value);
            Assert.Equal(2, checkouts.Count());

        }
    }
}
