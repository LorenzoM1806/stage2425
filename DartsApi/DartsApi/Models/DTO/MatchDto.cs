namespace DartsApi.Models.DTO
{
    public class MatchDto
    {
        public int Player1Id { get; set; }
        public int Player2Id { get; set; }
        public int GamemodeId { get; set; }
        public DateTime Datum { get; set; }

        public bool Finished { get; set; }
    }
}
