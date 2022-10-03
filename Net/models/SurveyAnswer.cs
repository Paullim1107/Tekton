using System;

namespace Sabio.Models.Domain.Surveys
{
    public class SurveyAnswer
    {
        public int Id { get; set; }

        public int InstanceId { get; set; }

        public int QuestionId { get; set; }

        public int AnswerOptionId { get; set; }

        public string Answer { get; set; }

        public int AnswerNumber { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

    }
}
