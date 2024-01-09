using MasterSoftERP.Libman.LIBPresentation.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LIBPresentation.Controllers
{
    public class GoogleCalendarController : Controller
    {
        //
        // GET: /GoogleCalendar/


        [CheckSessionOut]
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Singin()
        {

            return View();
        }

        public ActionResult CreateEvent()
        {
            return View();
        }

    }
}
