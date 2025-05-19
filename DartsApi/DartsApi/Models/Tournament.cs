namespace DartsApi.Models
{
    public class Tournament
    {
        public int Id { get; set; }
        public User? Winner { get; set; }
        public required DateTime Datum { get; set; }
    }
}
