using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Sluša")]
    public class Slusa
    {
        [Key]
        public int ID { get; set; }

        [Range(1,5)]
        [RegularExpression("\\d$")]
        public int Ocena { get; set; }

        [JsonIgnore]
        public virtual Kurs Kurs { get; set; }   

        [JsonIgnore]
        public virtual Ucenik Ucenik { get; set; }
    }
}