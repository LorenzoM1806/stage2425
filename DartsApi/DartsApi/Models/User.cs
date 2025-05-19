namespace DartsApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public Gamemode? FavoriteGame { get; set; }
        public required string Role { get; set; }
        public required bool IsDeleted { get; set; }
    }
}
