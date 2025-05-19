namespace DartsApi.Models.DTO
{
    public class MatchUpdateDto
    {
        public int Id { get; set; }
        public int Player1Id { get; set; }
        public int Player2Id { get; set; }
        public int GamemodeId { get; set; }
        public int WinnerId { get; set; }
        public DateTime Datum { get; set; }
        public bool Finished { get; set; }
    }
}
