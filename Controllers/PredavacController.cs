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
    public class PredavacController : ControllerBase
    {
        
        public SkolaContext Context { get; set; }

        public PredavacController(SkolaContext context)
        {
            Context=context;
        }

        [Route("PreuzmiPredavaceBezKursaZaSkolu/{idSkole}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiPredavaceBezKursaZaSkolu(int idSkole)
        {
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            try
            {
                var skole = await Context.Skola.Where(p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skole == null)
                {
                    throw new Exception($"Ne postoji škola sa ID:{idSkole}!");
                }
                
                var predavaci = await Context.Predavaci
                        .Where(p => p.PredavacKurs.Count == 0 &&  p.Skola.ID==idSkole)
                        .Select(p => new{
                            p.ID,
                            p.Ime,
                            p.Prezime,
                            p.JMBG,
                            p.Sertifikat,
                        }).ToListAsync();
                return Ok(predavaci);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [Route("DodatiPredavaca/{ime}/{prezime}/{jmbg}/{sertifikat}/{idSkole}")]
        [EnableCors("CORS")]
        [HttpPost]
        public async Task<ActionResult> dodatiPredavaca(string ime, string prezime, string jmbg, string sertifikat,int idSkole)
        {
            if(string.IsNullOrWhiteSpace(ime) || ime.Length > 30)
            {
                return BadRequest("Nevalidan unos za ime predavaca!");
            }
            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length > 30)
            {
                return BadRequest("Nevalidan unos za prezime predavaca!");
            }
            if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length != 13)
            {
                return BadRequest("Nevalidan unos za jmbg predavaca!");
            }
            if(string.IsNullOrWhiteSpace(sertifikat) || sertifikat.Length > 3)
            {
                return BadRequest("Nevalidan unos za sertifikat predavaca!");
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
                    throw new Exception($"Ne postoji škola sa ID:{idSkole}!");
                }
                var predavac = await Context.Predavaci.Where( p => p.JMBG==jmbg).FirstOrDefaultAsync();
                if( predavac != null )
                {
                    throw new Exception($"Postoji vec predavac sa jmbg - {jmbg}. Ne mozete dodati tog predavaca!");
                } 
                
                Predavac p = new Predavac();
                p.Ime = ime;
                p.Prezime = prezime;
                p.JMBG = jmbg;
                p.Sertifikat = sertifikat;
                p.Skola = skola;

                Context.Predavaci.Add(p);
                skola.Predavaci.Add(p);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno smo dodali predavaca sa ID: {p.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DodajSertifikat/{idPredavaca}")]
        [EnableCors("CORS")]
        [HttpPut]
        public async Task<ActionResult> dodajSertifikat(int idPredavaca)
        {
             if(idPredavaca < 0)
            {
                return BadRequest("Nevalidan unos za ID predavaca!");
            }
            try
            {
                var predavac = await Context.Predavaci.Where( p => p.ID == idPredavaca).FirstOrDefaultAsync();
                if(predavac == null)
                {
                    throw new Exception($"Ne postoji predavac sa tim ID:{idPredavaca}");
                }
                predavac.Sertifikat = "DA";
                Context.Predavaci.Update(predavac);
                await Context.SaveChangesAsync();
                return Ok($"Dodali smo sertifikat predavacu sa ID:{predavac.ID}!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("IzbrisiPredavaca/{idPredavaca}")]
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> izbrisatiPredavaca(int idPredavaca)
        {
            if(idPredavaca < 0)
            {
                return BadRequest("Nevalidan unos za ID predavaca!");
            }
            try
            {
                var predavac = await Context.Predavaci.Where( p => p.ID == idPredavaca).FirstOrDefaultAsync();
                if(predavac == null)
                {
                    throw new Exception($"Ne postoji predavac sa tim ID:{idPredavaca}");
                }
                
                Context.Predavaci.Remove(predavac);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno je izbrisan predavac sa ID:{idPredavaca}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    
   

    }
}
