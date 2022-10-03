using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Surveys
{
    public class SurveyQuestionBase
    {
        public int Id { get; set; }
        public string Question { get; set; }

        public int SortOrder { get; set; }

        public int QuestionTypeId { get; set; }

        public string QuestionType { get; set; }

        public List<AnswerOptions> AnswerOptions {get;set;}

    }
}
