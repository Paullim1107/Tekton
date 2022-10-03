using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Surveys
{
    public class SurveyInstance
    {
        public int Id { get; set; }

        public Survey Survey { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public LookUp Status { get; set; }

        public List<SurveyQuestionBase> SurveyQuestionAnswer { get; set; }
    }
}
