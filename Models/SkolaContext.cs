using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class SkolaContext:DbContext
    {
        public DbSet<Kurs> Kursevi { get; set; }

        public DbSet<Predavac> Predavaci { get; set; }

        public DbSet<Skola> Skola { get; set; }

        public DbSet<Slusa> Slusa { get; set; }

        public DbSet<Sadrzi> Sadrzaj { get; set; }

        public DbSet<Ucenik> Ucenici { get; set; }

        public DbSet<Predaje> Predaje { get; set; }

        public DbSet<Upravnik> Upravnici { get; set; }

        public SkolaContext(DbContextOptions opt) : base(opt)
        {
            
        }
    }
}