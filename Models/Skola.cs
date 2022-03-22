using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Škola")]
    public class Skola
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Naziv { get; set; }

        [JsonIgnore]
        public virtual List<Sadrzi> SkolaKurs { get; set; }

        [JsonIgnore]
        public virtual List<Predavac> Predavaci { get; set; }

        [JsonIgnore]
        public virtual List<Ucenik> Ucenici { get; set; }

        [JsonIgnore]
        public virtual Upravnik Upravnik { get; set; }

    }
}