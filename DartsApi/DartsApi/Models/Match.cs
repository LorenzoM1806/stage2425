namespace DartsApi.Models
{
    public class Match
    {
        public int Id { get; set; }
        public required User Player1 { get; set; }
        public required User Player2 { get; set; }
        public required Gamemode Gamemode { get; set; }
        public User? Winner { get; set; }
        public required DateTime Datum { get; set; }

        public required bool Finished { get; set; }
    }
}
