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
    public class PredajeController : ControllerBase
    {

        public SkolaContext Context { get; set; }

        public PredajeController(SkolaContext context)
        {
            Context=context;
        }

        [Route("PreuzmiPredavaceZaKurs/{idKursa}/{idSkole}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiPredavaceZaKurs(int idKursa, int idSkole)
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
                var skola = await Context.Skola.Where(p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skola == null)
                {
                    throw new Exception("Nemamo školu sa tim ID");
                }
                var kurs = await Context.Kursevi.Where(p => p.ID==idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception("Ne postoji kurs sa tim ID!");
                }
                var predavaci = await Context.Predaje
                        .Include(p => p.Predavac).Where(p => p.Predavac.Skola.ID==idSkole)
                        .Include(p => p.Kurs).Where(p => p.Kurs.ID==idKursa)
                        .Select(p => new{
                                p.Predavac.ID,
                                p.Predavac.Ime,
                                p.Predavac.Prezime,
                                p.Predavac.JMBG,
                                p.Predavac.Sertifikat,
                                p.Kurs.Naziv
                            }).ToListAsync();
                if(predavaci == null)
                {
                    throw new Exception("Ne postoji predavač za kurs!");
                }
                return Ok(predavaci);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("DodatiPredavacaKursu/{idPredavaca}/{idKursa}")]
        [EnableCors("CORS")]
        [HttpPost]
        public async Task<ActionResult> dodatiPredavacaKursu( int idPredavaca, int idKursa)
        {
            if(idPredavaca < 0)
            {
                return BadRequest("Nevalidan unos za ID predavaca!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            try
            {
                var predavac = await Context.Predavaci.Where(p => p.ID==idPredavaca).FirstOrDefaultAsync();
                if(predavac == null)
                {
                    throw new Exception($"Ne postoji predavač sa ID:{idPredavaca}!");
                }
                var kurs = await Context.Kursevi.Where(p => p.ID == idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Ne postoji kurs sa ID:{idKursa}!");
                }
                var spoj = await Context.Predaje.Where(p => p.Kurs.ID==idKursa && p.Predavac.ID==idPredavaca).FirstOrDefaultAsync();
                if(spoj != null)
                {
                    throw new Exception($"Već smo dodali predavača kursu!");
                }
                if(predavac.Sertifikat == "DA")
                {
                    Predaje p = new Predaje();
                    p.Kurs = kurs;
                    p.Predavac = predavac;
                    Context.Predaje.Add(p);
                    await Context.SaveChangesAsync();
                    return Ok("Uspešno smo dodali predavača na kurs!");
                }
                else
                {
                    throw new Exception("Nije moguće dodati predavača na kurs ako nema seritifikat!");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }
    
        
        [Route("UkloniPredavacaSaKursa/{idPredavaca}/{idKursa}")]
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> izbrisiPredavacaSaKursa(int idPredavaca,int idKursa)
        {
            if(idPredavaca < 0)
            {
                return BadRequest("Nevalidan unos za ID predavaca!");
            }
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            try
            {
                var predavac = await Context.Predavaci.Where(p => p.ID==idPredavaca).FirstOrDefaultAsync();
                if(predavac == null)
                {
                    throw new Exception($"Ne postoji predavač sa ID:{idPredavaca}!");
                }
                var kurs = await Context.Kursevi.Where(p => p.ID == idKursa).FirstOrDefaultAsync();
                if(kurs == null)
                {
                    throw new Exception($"Ne postoji kurs sa ID:{idKursa}!");
                }
                var spoj = await Context.Predaje.Where(p => p.Kurs.ID==idKursa &&  p.Predavac.ID==idPredavaca).FirstOrDefaultAsync();
                if(spoj == null)
                {
                    throw new Exception($"Ne postoji relaciji za ovaj kurs!");
                }

                Context.Predaje.Remove(spoj);
                await Context.SaveChangesAsync();
                return Ok("Uspesno smo uklonili predavaca sa kursa!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    

    }
}
