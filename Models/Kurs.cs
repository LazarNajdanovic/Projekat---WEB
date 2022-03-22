using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Kurs")]
    public class Kurs
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Naziv { get; set; }

        [Required]
        [Column("Cena(€)")]
        [Range(50,500)]
        [RegularExpression("\\d+$")]
        public int Cena { get; set; }

        [Required]
        [Column("Vreme trajanja kursa(u mesecima)")]
        [RegularExpression("\\d+$")]
        [Range(1,12)]
        public int VremeTrajanja { get; set; }


        [JsonIgnore]
        public virtual List<Sadrzi> KursSkola { get; set; }

        [JsonIgnore]
        public virtual List<Predaje> KursPredavac { get; set; }

        [JsonIgnore]
        public virtual List<Slusa> KursUcenik {get; set; }
    }
}