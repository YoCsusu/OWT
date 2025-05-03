using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public interface IBoatRepository
    {
        void InsertBoat(Boat boat, Guid guid = default(Guid));
        IEnumerable<Boat> GetBoats();
        Boat GetBoatByID(Guid guid);
        void UpdateBoat(Boat boat);
        void DeleteBoat(Guid guid);
        void Save();
    }
}
