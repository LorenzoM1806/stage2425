using DartsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DartsApi.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Checkout> Checkouts { get; set; }
        public DbSet<User> Users {get; set;}
        public DbSet<Gamemode> Gamemodes {get; set;}
        public DbSet<Match> Matches {get; set;}
        public DbSet<Throw> Throws {get; set;}
        public DbSet<Tournament> Tournaments {get; set;}
        public DbSet<TournamentMatch> TournamentMatches {get; set;}
        public DbSet<TournamentParticipant> TournamentParticipants {get; set;}
    }
}
