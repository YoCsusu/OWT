using BLL;
using DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class BoatController : ControllerBase
    {
        private readonly IBoatRepository _boatRepository;

        private readonly ApplicationDbContext _applicationDbContext;

        private readonly ILogger<BoatController> _logger;

        public BoatController(ApplicationDbContext applicationDbContext, ILogger<BoatController> logger)
        {
            _applicationDbContext = applicationDbContext;

            _boatRepository = new BoatRepository(_applicationDbContext);

            _logger = logger;
        }


        /// <summary>
        /// Adding a Boat
        /// </summary>
        /// <remarks>Add a Boat</remarks>
        /// <response code="200">Add a Boat</response>
        /// <response code="404">Add a cabiBoatnet not found</response>
        [HttpPost]
        public ActionResult<Boat> InsertBoat([FromBody] Boat boat)
        {
            _boatRepository.InsertBoat(boat);
            try
            {
                _boatRepository.Save();
                _logger.LogInformation("Boat Inserted with id: {id}", boat.Id);
            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Boat Not Inserted: {ex.Message}");
                return BadRequest(ex.Message);
            }

            return Ok(boat);
        }

        /// <summary>
        /// Retrieves list of all Boat
        /// </summary>
        /// <remarks>List of all Boat</remarks>
        /// <response code="200">List of all Boat</response>
        /// <response code="404">List of all Boat not found</response>
        [HttpGet]
        public ActionResult GetBoats()
        {
            var boats = _boatRepository.GetBoats();

            //DO this for simulacre of ViewModel
            return boats == null ? NotFound() : Ok(boats.Select(x => new
            {
                x.Id,
                x.Name,
                x.Description
            }));
        }

        /// <summary>
        /// Retrieves a Boat by Id
        /// </summary>
        /// <remarks>a Boat by id</remarks>
        /// <response code="200">a Boat by id</response>
        /// <response code="404">a Boat by id not found</response>
        [HttpGet("{guid:guid}")]
        public ActionResult<Boat> GetBoatByID([FromRoute] Guid guid)
        {
            var boat = _boatRepository.GetBoatByID(guid);

            return boat == null ? NotFound() : Ok(boat);
        }

        /// <summary>
        /// Updating a Boat
        /// </summary>
        /// <remarks>Update a Boat</remarks>
        /// <response code="200">Update a Boat</response>
        /// <response code="404">Update a caBoatbinet not found</response>
        [HttpPatch()]
        public ActionResult<Boat> UpdateBoat([FromBody] Boat boat)
        {
            _boatRepository.UpdateBoat(boat);

            try
            {
                _boatRepository.Save();
                _logger.LogInformation("Boat Updated with id: {id}", boat.Id);
            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Boat Not Updated: {ex.Message}");
                return BadRequest(ex.Message);
            }

            //DO this for simulacre of ViewModel
            return Ok(new
            {
                boat.Id,
                boat.Name,
                boat.Description
            });
        }

        /// <summary>
        /// Delete a Boat by Id
        /// </summary>
        /// <remarks>Delete Boat by id</remarks>
        /// <response code="200">Boat by id</response>
        /// <response code="404">Boat by id not found</response>
        [HttpDelete("{guid:guid}")]
        public ActionResult<Boat> DeleteBoat([FromRoute] Guid guid)
        {
            _boatRepository.DeleteBoat(guid);

            try
            {
                _boatRepository.Save();
                _logger.LogInformation("Boat Deleted with id: {id}", guid);
            }
            catch (Exception ex)
            {
                _logger.LogCritical($"Boat Not Deleted: {ex.Message}");
                return BadRequest(ex.Message);
            }

            return Ok();
        }
    }
}
