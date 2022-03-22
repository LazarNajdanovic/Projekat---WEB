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
    public class UcenikController : ControllerBase
    {
        public SkolaContext Context { get; set; }
        public UcenikController(SkolaContext context)
        {
            Context = context;
        }

        [Route("PreuzmiUcenika/{clanskaKnjizica}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> preuzmiUcenika(int clanskaKnjizica)
        {
            if(clanskaKnjizica < 1000 || clanskaKnjizica > 5000)
            {
                return BadRequest("Nevalidan unos broja knjizice!");
            }
            try
            {
                /*var ucenik = await Context.Ucenici
                .Where(p => p.ClanskaKnjizica == clanskaKnjizica).FirstOrDefaultAsync();*/
                var ucenik = await Context.Slusa
                    .Where(p => p.Ucenik.ClanskaKnjizica == clanskaKnjizica)
                    .Select(p => new{
                        p.Ucenik.ID,
                        p.Ucenik.Ime,
                        p.Ucenik.Prezime,
                        p.Ucenik.ImeRoditelja,
                        p.Ucenik.ClanskaKnjizica,
                        p.Ocena     
                    }).FirstOrDefaultAsync();
                if( ucenik == null )
                {
                    throw new Exception($"Ne postoji ucenik sa tom clanskom knjizicom {clanskaKnjizica}");
                }
                return Ok(ucenik);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        
        [Route("DodatiUcenika/{ime}/{prezime}/{imeRoditelja}/{clanskaKnjizica}/{idSkole}")]
        [EnableCors("CORS")]
        [HttpPost]
        public async Task<ActionResult> dodatiUcenika( string ime, string prezime, string imeRoditelja, int clanskaKnjizica, int idSkole)
        {
            if(string.IsNullOrWhiteSpace(ime) || ime.Length>30)
            {
                return BadRequest("Nevalidan unos imena ucenika!");
            }
            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length>30)
            {
                return BadRequest("Nevalidan unos prezimena ucenika!");
            }
            if(string.IsNullOrWhiteSpace(imeRoditelja) || imeRoditelja.Length>30)
            {
                return BadRequest("Nevalidan unos imena roditelja ucenika!");
            }
            if(clanskaKnjizica < 1000 || clanskaKnjizica > 5000)
            {
                return BadRequest("Nevalidan unos broja knjizice!");
            }
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            try
            {
                var ucenik = await Context.Ucenici.Where(p => p.ClanskaKnjizica==clanskaKnjizica && p.Skola.ID==idSkole).FirstOrDefaultAsync();
                if( ucenik != null )
                    throw new Exception($"Vec postoji ucenik zadatim brojem knjizice {clanskaKnjizica} u skoli!");
                var skola = await Context.Skola.Where(p => p.ID==idSkole).FirstOrDefaultAsync();
                if(skola == null)
                {
                    throw new Exception("Ne postoji sa tim ID!");
                }
                Ucenik u = new Ucenik();
                u.Ime=ime;
                u.Prezime=prezime;
                u.ImeRoditelja=imeRoditelja;
                u.ClanskaKnjizica=clanskaKnjizica;
                u.Skola = skola;

                Context.Ucenici.Add(u);
                skola.Ucenici.Add(u);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno smo dodali ucenika {u.Ime} {u.Prezime} sa ID:{u.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("IzbrisatiUcenika/{idUcenika}")]
        [EnableCors("CORS")]
        [HttpDelete]
        public async Task<ActionResult> izbrisiUcenika(int idUcenika)
        {
            if(idUcenika < 0)
            {
                return BadRequest("Nevalidan ID broj ucenika!");
            }
            try
            {
                var ucenik = await Context.Ucenici.Where( p => p.ID==idUcenika).FirstOrDefaultAsync();
                if(ucenik == null)
                {
                    throw new Exception($"Ucenik sa ID:{idUcenika} ne postoji u bazi!");
                }
                
                Context.Ucenici.Remove(ucenik);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno je obrisan ucenik sa ID:{idUcenika}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    

    }
}
