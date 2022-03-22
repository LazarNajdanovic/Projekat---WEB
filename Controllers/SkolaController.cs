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
    public class SkolaController : ControllerBase
    {
        public SkolaContext Context { get; set; }

        public SkolaController(SkolaContext context)
        {
            Context=context;
        }

        [Route("PreuzmiSkole")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> preuzmiSkole()
        {
            try
            {
                var skole = await Context.Skola.Select( p => new {
                    p.ID,
                    p.Naziv
                }).ToListAsync();
                return Ok(skole);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        

    }
}
