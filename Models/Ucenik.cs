using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Učenik")]
    public class Ucenik
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
        [MaxLength(30)]
        [Column("Ime roditelja")]
        public string ImeRoditelja { get; set; }

        [Required]
        [Range(1000,5000)]
        [Column("Članska knjižica")]
        [RegularExpression("\\d+$")]
        public int ClanskaKnjizica { get; set; }    

        [JsonIgnore]
        public virtual List<Slusa> UcenikKurs{ get; set; }

        [JsonIgnore]
        public virtual Skola Skola { get; set; }

    }
}