using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class BoatRepository : IBoatRepository
    {
        private readonly ApplicationDbContext _applicationDbContext;

        public BoatRepository(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        public void InsertBoat(Boat boat, Guid guid = default)
        {
            _applicationDbContext.Boats.Add(boat);
        }

        public IEnumerable<Boat> GetBoats()
        {
            return _applicationDbContext.Boats;
        }

        public Boat GetBoatByID(Guid guid)
        {
            return _applicationDbContext.Boats.First(x => x.Id == guid);
        }

        public void UpdateBoat(Boat boat)
        {
            _applicationDbContext.Update(boat);
        }

        public void DeleteBoat(Guid guid)
        {
            var boat = GetBoatByID(guid);
            _applicationDbContext.Boats.Remove(boat);
        }

        public void Save()
        {
            using var transaction = _applicationDbContext.Database.BeginTransaction();
            try
            {
                _applicationDbContext.SaveChanges();
                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw ex;
            }
        }


    }
}
