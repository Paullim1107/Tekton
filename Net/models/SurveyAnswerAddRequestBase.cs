using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveyAnswers
{
    public class SurveyAnswerAddRequestBase
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int QuestionId { get; set; }

        public int? AnswerOptionId { get; set; }

        public string Answer { get; set; }

        public int? AnswerNumber { get; set; }

    }
}
