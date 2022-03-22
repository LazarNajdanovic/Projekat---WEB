using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Predaje")]
    public class Predaje
    {
        [Key]
        public int ID { get; set; }

        [JsonIgnore]
        public virtual Kurs Kurs { get; set; }

        [JsonIgnore]
        public virtual Predavac Predavac { get; set; }
    }
}