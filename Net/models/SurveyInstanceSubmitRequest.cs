using Sabio.Models.Requests.SurveyAnswers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveysInstances
{
    public class SurveyInstanceSubmitRequest 
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int SurveyId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int StatusId { get; set; }

        public List<SurveyAnswerAddRequestBase> BatchSurveys { get; set; }
    }
}
