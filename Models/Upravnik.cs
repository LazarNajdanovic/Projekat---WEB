using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Upravnik")]
    public class Upravnik
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$")]
        [Column("E-mail")]
        public string email { get; set; }  

        [Required]
        [MaxLength(20)]
        [Column("Password")]
        public string password { get; set; } 


        [JsonIgnore]
        public virtual List<Skola> Skole { get; set; }

    }
}