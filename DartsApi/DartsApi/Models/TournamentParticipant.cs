namespace DartsApi.Models
{
    public class TournamentParticipant
    {
        public int Id { get; set; }
        public required Tournament Tournament { get; set; }
        public required User Player { get; set; }
    }
}
