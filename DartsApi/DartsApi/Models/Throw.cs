namespace DartsApi.Models
{
    public class Throw
    {
        public int Id { get; set; }
        public required Match Match { get; set; }
        public required int Throw1 { get; set; }
        public required int Throw2 { get; set; }
        public required int Throw3 { get; set; } 
        public required User Speler { get; set; }
        public required DateTime Datum { get; set; }
    }
}
