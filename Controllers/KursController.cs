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
    public class KursController : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public KursController(SkolaContext context)
        {
            Context=context;
        }

        [Route("PreuzmiKurs/{idKursa}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> preuzmiKurs(int idKursa)
        {
            if(idKursa < 0)
            {
                return BadRequest("Nevalidan unos za ID kursa!");
            }
            try
            {
                var kurs = await Context.Sadrzaj.Where(p => p.Kurs.ID == idKursa)
                    .Select(p => new {
                        p.Kurs.ID,
                        p.Kurs.Naziv,
                        p.Kurs.Cena,
                        p.Kurs.VremeTrajanja,
                        p.BrojUcenika
                    }).FirstOrDefaultAsync();
                return Ok(kurs);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PreuzmiKurseve")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> preuzmiKurseve()
        {
            try
            {
                var kursevi = await Context.Kursevi.Select(p => new {
                    p.ID,
                    p.Naziv,
                    p.Cena,
                    p.VremeTrajanja
                }).ToListAsync();
                return  Ok(kursevi);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
             
  
    }
}
