using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
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
    public class UpravnikController : ControllerBase
    {

        public SkolaContext Context { get; set; }

        public UpravnikController(SkolaContext context)
        {
            Context=context;
        }


        [Route("PreuzmiUpravnika/{idSkole}")]
        [EnableCors("CORS")]
        [HttpGet]
        public async Task<ActionResult> preuzmiUpravnika(int idSkole)
        {
            if(idSkole < 0)
            {
                return BadRequest("Nevalidan unos za ID skole!");
            }
            try
            {
                var upravnik = await Context.Skola.Where(p => p.ID==idSkole)
                            .Select(p => new{
                                p.Upravnik.ID,
                                p.Upravnik.email,
                                p.Upravnik.password
                            }).FirstOrDefaultAsync();
                return Ok(upravnik);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [NonAction]
        public bool provera(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        [Route("DodatiUpravnika/{email}/{pass}")]
        [EnableCors("CORS")]
        [HttpPost]
        public async Task<ActionResult> dodatiUpravnika(string email, string pass)
        {
            if(string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Nevalidan unos za email upravnika!");
            }
            if(string.IsNullOrWhiteSpace(pass) || pass.Length > 20)
            {
                return BadRequest("Nevalidan unos password-a upravnika!");
            }
            try
            {
                if(!provera(email))
                {
                    throw new Exception("Niste lepo uneli e-mail!");
                }
                var upravnik = await Context.Upravnici.Where(p => p.email==email).FirstOrDefaultAsync();
                if(upravnik != null)
                {
                    throw new Exception("Vec postoji taj upravnik!");
                }
                Upravnik u = new Upravnik();
                u.email=email;
                u.password=pass;
                Context.Upravnici.Add(u);
                await Context.SaveChangesAsync();
                return Ok("Uspesno je dodat upravnik!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        
    }
}
