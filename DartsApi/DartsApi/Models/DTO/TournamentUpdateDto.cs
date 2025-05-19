namespace DartsApi.Models.DTO
{
    public class TournamentUpdateDto
    {
        public int Id { get; set; }
        public int WinnerId { get; set; }
        public DateTime Datum { get; set; }
    }
}
