using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace WEB___NEW.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SadrziController : ControllerBase
    {

        public SkolaContext Context { get; set; }

        public SadrziController(SkolaContext context)
        {
            Context=context;
        }

        [Route("PreuzmiKurseveZaSkolu/{idSkole}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKurseveZaSkolu(int idSkole)
        {
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            try
            {
                var skola = await Context.Skola.Where(p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skola == null)
                {
                    throw new Exception($"Ne postoji sa ID: {idSkole}!");
                }
                var kursevi = await Context.Sadrzaj
                            .Where(p => p.Skola.ID==idSkole).Select(p => new {
                                p.Kurs.ID,
                                p.Kurs.Naziv,
                                p.Kurs.Cena,
                                p.Kurs.VremeTrajanja
                            }).ToListAsync();
                if(kursevi == null)
                {
                    throw new Exception("Nismo pronasli kurseve u ovoj skoli!");
                }
                return Ok(kursevi);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DodatiKursSkoli/{idSkole}/{idKursa}/{brojUcenika}")]
        [EnableCors("CORS")]
        [HttpPost]
        public async Task<ActionResult> dodatiKursSkoli( int idSkole, int idKursa, int brojUcenika)
        {
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            if(brojUcenika < 5 || brojUcenika > 50)
            {
                return BadRequest("Nevalidan unos za broj ucenika!");
            }
            try
            {
                var skola = await Context.Skola.Where( p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skola == null)
                {
                    throw new Exception($"Skola sa ID: {idSkole} ne postoji!");
                }
                var kurs = await Context.Kursevi.Where( p => p.ID==idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Kurs sa ID: {idKursa} ne postoji!");
                }
                var relacija = await Context.Sadrzaj.Where(p => p.Skola.ID==idSkole && p.Kurs.ID==idKursa).FirstOrDefaultAsync();
                if(relacija != null)
                {
                    throw new Exception("Vec smo dodaji ovaj kurs skoli!");
                }
                
                Sadrzi sadrzaj = new Sadrzi();
                sadrzaj.Skola = skola;
                sadrzaj.Kurs = kurs;
                sadrzaj.BrojUcenika = brojUcenika;

                Context.Sadrzaj.Add(sadrzaj);
                await Context.SaveChangesAsync();
                return Ok("Uspesno je upisan kurs skoli!");              
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //Ovo mozda i ne treba, da nemam tu opciju!
        [Route("IzbrisatiKursSkoli/{idSkole}/{idKursa}")]
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> izbrisatiKursSkoli(int idSkole, int idKursa)
        {
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            try
            {
                var skola = await Context.Skola.Where( p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skola == null)
                {
                    throw new Exception($"Skola sa ID: {idSkole} ne postoji!");
                }
                var kurs = await Context.Kursevi.Where( p => p.ID==idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Kurs sa ID: {idKursa} ne postoji!");
                }
                var relacija = await Context.Sadrzaj.Where(p => p.Skola.ID==idSkole && p.Kurs.ID==idKursa).FirstOrDefaultAsync();
                if(relacija == null)
                {
                    throw new Exception("Ne postoji ovaj kurs u skoli!");
                }                
                var provera = await Context.Sadrzaj
                            .Include(p => p.Skola).Where(p => p.ID==idSkole)
                            .Include(p => p.Kurs).Where(p => p.Kurs.ID==idKursa && p.Kurs.KursUcenik.Count() != 0)
                            .FirstOrDefaultAsync();
                if(provera != null)  
                {
                    throw new Exception("Nije moguce izbrisati kurs skoli jer ima ucenika na kursu!");
                }        
                Context.Sadrzaj.Remove(relacija);
                await Context.SaveChangesAsync();
                return Ok("Izbrisali smo kurs u ovoj skoli!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
