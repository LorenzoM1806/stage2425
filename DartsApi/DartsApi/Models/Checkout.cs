using System.ComponentModel.DataAnnotations;

namespace DartsApi.Models
{
    public class Checkout
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public string CheckoutPath { get; set; }
    }
}
