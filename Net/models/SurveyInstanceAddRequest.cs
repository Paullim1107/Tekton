using Sabio.Models.Requests.SurveyAnswers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveysInstances
{
    public class SurveyInstanceUpdateRequest : SurveyInstanceAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
