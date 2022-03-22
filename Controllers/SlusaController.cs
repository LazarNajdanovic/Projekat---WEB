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
    public class SlusaController : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public SlusaController(SkolaContext context)
        {
            Context=context;
        }

        [Route("PreuzmiUcenikeZaKurs/{idKursa}/{idSkole}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiUcenikeZaKurs( int idKursa, int idSkole )
        {
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            try
            {
                var kurs = await Context.Kursevi.Where(p => p.ID==idKursa).FirstOrDefaultAsync();
                if( kurs == null )
                {
                    throw new Exception($"Ne postoji kurs sa ID: {idKursa}!");
                }
                var skola = await Context.Skola.Where(p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skola == null)
                {
                    throw new Exception("Ne postoji skola sa tim ID!");
                }
                var ucenici = await Context.Slusa.Where(p => p.Kurs.ID==idKursa)
                            //.Include( p => p.Kurs).Where( p => p.ID==idKursa)
                            .Include( p => p.Ucenik).Where(p => p.Ucenik.Skola.ID==idSkole)
                            .Select( p => new 
                            {
                                //p.Kurs.Naziv,
                                p.Ucenik.ID,
                                p.Ucenik.Ime,
                                p.Ucenik.Prezime,
                                p.Ucenik.ImeRoditelja,
                                p.Ucenik.ClanskaKnjizica,
                                p.Ocena                             
                            }).ToListAsync();
                return Ok(ucenici);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PreuzmiUcenikeBezKursaZaSkolu/{idSkole}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> preuzmiUcenikeBezKursa(int idSkole)
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
                    throw new Exception("Ne postoji skola sa tim ID!");
                }
                var ucenici = await Context.Ucenici
                            .Where(p => p.UcenikKurs.Count == 0 && p.Skola.ID==idSkole)
                            .Select(p => new{
                                p.ID,
                                p.Ime,
                                p.Prezime,
                                p.ImeRoditelja,
                                p.ClanskaKnjizica
                            }).ToListAsync();
                return Ok(ucenici);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("UpisiUcenikaNaKurs/{idUcenika}/{idKursa}")]
        [EnableCors("CORS")]
        [HttpPost]
        public async Task<ActionResult> upisiUcenika( int idUcenika, int idKursa)
        {
            if(idUcenika < 0)
            {
                return BadRequest("Nevalidan unos za ID ucenika!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.ID==idUcenika).FirstOrDefaultAsync();
                if(ucenik == null)
                {
                    throw new Exception($"Ucenik sa ID: {idUcenika} ne postoji!");
                }
                var kurs = await Context.Kursevi.Where( p => p.ID==idKursa ).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Kurs sa ID: {idKursa} ne postoji!");
                }
                var spoj = await Context.Slusa.Where( p => p.Kurs.ID==idKursa && p.Ucenik.ID==idUcenika).FirstOrDefaultAsync();
                if( spoj != null )
                    throw new Exception("Učenik je već upisan na kurs!");
                
                var spoj1 = await Context.Sadrzaj.Where(p => p.Kurs.ID == idKursa).FirstOrDefaultAsync();
                if(spoj1 == null)
                {
                    throw new Exception("Ne postoji kurs u toj skoli!");
                }

                if(spoj1.BrojUcenika != 0)
                {
                    Slusa s = new Slusa();
                    s.Ucenik=ucenik;
                    s.Kurs=kurs;
                    spoj1.BrojUcenika--;
                    Context.Slusa.Add(s);
                    Context.Sadrzaj.Update(spoj1);
                    await Context.SaveChangesAsync();
                    return Ok("Uspesno je upisan ucenik na kurs!");
                }
                else
                {
                    throw new Exception("Nije moguce dodati ucenika, popunjen je broj!");
                }
                              
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("UpisiOcenuUceniku/{idUcenika}/{idKursa}/{ocena}")]
        [EnableCors("CORS")]
        [HttpPut]
        public async Task<ActionResult> upisiOcenu(int idUcenika, int idKursa, int ocena)
        {
            if(idUcenika < 0)
            {
                return BadRequest("Nevalidan unos za ID ucenika!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            if (ocena <= 0 || ocena > 5)
            {
               return BadRequest("Nije validna ocena!");
            }
            try
            {
                var ucenik = await Context.Ucenici.Where( p => p.ID==idUcenika).FirstOrDefaultAsync();
                if(ucenik == null)
                {
                    throw new Exception($"Ucenik sa ID: {idUcenika} ne postoji!");
                }
                var kurs = await Context.Kursevi.Where( p => p.ID==idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Kurs sa ID: {idKursa} ne postoji!");
                }
                var spoj = await Context.Slusa.Where( p => p.Kurs.ID == idKursa && p.Ucenik.ID == idUcenika).FirstOrDefaultAsync();
                if( spoj == null )
                {
                    throw new Exception("Ne postoji ovakav spoj!");
                }
                
                spoj.Ocena=ocena;
                Context.Slusa.Update(spoj);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno smo upisali ocenu uceniku sa ID:{idUcenika}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ObrisatiUcenikaSaKursa/{idUcenika}/{idKursa}")]
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> obrisatiUcenika(int idUcenika, int idKursa)
        {
             if(idUcenika < 0)
            {
                return BadRequest("Nevalidan unos za ID ucenika!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            try
            {
                var ucenik = await Context.Ucenici.Where( p => p.ID==idUcenika).FirstOrDefaultAsync();
                if(ucenik == null)
                {
                    throw new Exception($"Ucenik sa ID: {idUcenika} ne postoji!");
                }
                var kurs = await Context.Kursevi.Where( p => p.ID==idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Kurs sa ID: {idKursa} ne postoji!");
                }
                var spoj = await Context.Slusa.Where( p => p.Kurs.ID == idKursa && p.Ucenik.ID == idUcenika).FirstOrDefaultAsync();
                if( spoj == null )
                    throw new Exception("Ne postoji ovakav spoj!");
                if(spoj.Ocena < 3) // Zamislio sam da se moze izbrisati ucenik koji ima ocenu vecu od 3
                {
                    throw new Exception("Nije moguce izbrisati ucenika koji ima manju ocenu od 4!");
                }
                var spoj1 = await Context.Sadrzaj.Where(p => p.Kurs.ID == idKursa).FirstOrDefaultAsync();
                if(spoj1 == null)
                {
                    throw new Exception("Ne postoji kurs u toj skoli!");
                }

                spoj1.BrojUcenika++;
                Context.Slusa.Remove(spoj);
                Context.Sadrzaj.Update(spoj1);
                await Context.SaveChangesAsync();
                return Ok("Uspesno smo uklonili ucenika sa kursa!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
   

    }
}
