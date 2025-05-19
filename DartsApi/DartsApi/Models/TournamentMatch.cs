namespace DartsApi.Models
{
    public class TournamentMatch
    {
        public int Id { get; set; }
        public required Tournament Tournament { get; set; }
        public required Match Match { get; set; }
        public required string Round {  get; set; }
    }
}
