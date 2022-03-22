using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Predavač")]
    public class Predavac
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Ime { get; set; }

        [Required]
        [MaxLength(30)]
        public string Prezime { get; set; }

        [Required]
        [MinLength(13),MaxLength(13)]
        [RegularExpression("\\d$")]
        public string JMBG { get; set; }

        [Required]
        [MaxLength(3)]
        public string Sertifikat { get; set; }

        [JsonIgnore]
        public virtual List<Predaje> PredavacKurs { get; set; }

        [JsonIgnore]
        public virtual Skola Skola { get; set; }

    }
}