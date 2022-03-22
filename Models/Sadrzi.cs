using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Sadrži")]
    public class Sadrzi
    {
        [Key]
        public int ID { get; set; } 

        [Required]
        [Column("Broj učenika")]
        [Range(5,50)]
        [RegularExpression("\\d+$")]
        public int BrojUcenika { get; set; }

        [JsonIgnore]
        public virtual Skola Skola { get; set; }

        [JsonIgnore]
        public virtual Kurs Kurs { get; set; }
    }
}