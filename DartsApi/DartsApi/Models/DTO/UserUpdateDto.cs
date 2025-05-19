namespace DartsApi.Models.DTO
{
    public class UserUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int FavoriteGameId { get; set; }
        public string Role {  get; set; }
        public bool IsDeleted { get; set; }
    }
}
