using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.SurveyAnswers;
using Sabio.Models.Requests.SurveysInstances;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class SurveyInstanceService : ISurveyInstanceService
    {
        IDataProvider _data = null;
        IUserMapperService _userMapper = null;
        ILookUpService _lookUp = null;

        public SurveyInstanceService(IDataProvider data, IUserMapperService userMapper , ILookUpService lookUp)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUp = lookUp;
        }

        public int AddSurveyInstance(SurveyInstanceAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[SurveysInstances_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            }
            );

            return id;
        }

        public int SubmitSurveyInstance(SurveyInstanceSubmitRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[SurveysInstances_InsertV2]";

            DataTable dt = new DataTable();
            dt = MapToTable(model.BatchSurveys);

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@batchSurveys", dt);
                col.AddWithValue("@SurveyId", model.SurveyId);
                col.AddWithValue("@StatusId", model.StatusId);
                col.AddWithValue("@UserId", userId);

                SqlParameter idOut = new SqlParameter("@InstanceId", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@InstanceId"].Value;

                int.TryParse(oId.ToString(), out id);
            }
            );

            return id;
        }

        public int UpdateSurveyInstance(SurveyInstanceUpdateRequest model, int userId)
        {
            string procName = "[dbo].[SurveysInstances_Update]";

           var result = _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

                col.AddWithValue("@Id", model.Id);

                
            },
            returnParameters: null);
            

            return result;
        }

        public SubmitSurveyInstance GetBySurveyInstanceId(int id)
        {
            string procName = "[dbo].[SurveysInstances_Select_ByInstanceId]";

            SubmitSurveyInstance surveyInstance = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                surveyInstance = MapSingleSurveyInstance(reader, ref startingIndex);
            }
            );

            return surveyInstance;
        }


        public SubmitSurveyInstance GetBySurveyId(int id)
        {
            string procName = "[dbo].[SurveysInstances_Select_BySurveyId]";

            SubmitSurveyInstance surveyInstance = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                surveyInstance = MapSingleSurveyInstance(reader, ref startingIndex);
            }
            );

            return surveyInstance;
        }

        public SurveyInstance GetBySurveyIdV2(int id)
        {
            string procName = "[dbo].[SurveysInstances_Select_BySurveyId_V2]";

            SurveyInstance surveyInstance = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                surveyInstance = MapSingleSurveyInstanceV2(reader, ref startingIndex);
            }
            );

            return surveyInstance;
        }

        public Paged<SubmitSurveyInstance> Pagination(int pageIndex, int pageSize)
        {
            Paged<SubmitSurveyInstance> pagedResult = null;
            List<SubmitSurveyInstance> result = null;

            int totalCount = 0;
            string procName = "[dbo].[SurveysInstances_SelectAll]";

            _data.ExecuteCmd(
                procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    SubmitSurveyInstance surveyInstance = MapSingleSurveyInstance(reader, ref startingIndex);

                    if(totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if(result == null)
                    {
                        result = new List<SubmitSurveyInstance>();
                    }

                    result.Add(surveyInstance);
                }
                ) ;

            if(result != null)
            {
                pagedResult = new Paged<SubmitSurveyInstance>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;

        }


        private static void AddCommonParams(SurveyInstanceAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@SurveyId", model.SurveyId);
            col.AddWithValue("@UserId", userId);
            col.AddWithValue("@StatusId", model.StatusId);

            
        }


        private SubmitSurveyInstance MapSingleSurveyInstance(IDataReader reader, ref int startingIndex)
        {
            SubmitSurveyInstance surveyInstance = new SubmitSurveyInstance();
            surveyInstance.Survey = new Survey();
            surveyInstance.User = new User();

            surveyInstance.Id = reader.GetSafeInt32(startingIndex++);
            surveyInstance.Survey.Name = reader.GetSafeString(startingIndex++);
            surveyInstance.Survey.CompanyLogo = reader.GetSafeString(startingIndex++);

            surveyInstance.Survey.SurveyType = _lookUp.MapSingleLookUp(reader, ref startingIndex);

            surveyInstance.DateCreated = reader.GetSafeDateTime(startingIndex++);
            surveyInstance.DateModified = reader.GetSafeDateTime(startingIndex++);
            surveyInstance.User.Id = reader.GetSafeInt32(startingIndex++);
            surveyInstance.User.Email = reader.GetSafeString(startingIndex++);

            surveyInstance.UserProfile = _userMapper.MapSingleUserProfileV2(reader, ref startingIndex);
     
            surveyInstance.SurveyQuestionAnswer = reader.DeserializeObject<List<SurveyQuestionAnswer>>(startingIndex++);
            
            return surveyInstance;

        }

        private SurveyInstance MapSingleSurveyInstanceV2(IDataReader reader, ref int startingIndex)
        {
            SurveyInstance surveyInstance = new SurveyInstance();
            surveyInstance.Survey = new Survey();

            surveyInstance.Id = reader.GetSafeInt32(startingIndex++);
            surveyInstance.Survey.Name = reader.GetSafeString(startingIndex++);
            surveyInstance.Survey.CompanyLogo = reader.GetSafeString(startingIndex++);
            surveyInstance.Survey.Description = reader.GetSafeString(startingIndex++);

            surveyInstance.Survey.SurveyType = _lookUp.MapSingleLookUp(reader, ref startingIndex);


            surveyInstance.SurveyQuestionAnswer = reader.DeserializeObject<List<SurveyQuestionBase>>(startingIndex++);

            return surveyInstance;

        }

        private static DataTable MapToTable(List<SurveyAnswerAddRequestBase> batch)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("QuestionId", typeof(int));
            dt.Columns.Add("AnswerOptionId", typeof(int));
            dt.Columns.Add("Answer", typeof(string));
            dt.Columns.Add("AnswerNumber", typeof(int));

            foreach (SurveyAnswerAddRequestBase item in batch)
            {
                DataRow dr = dt.NewRow();

                int startingIndex = 0;
                dr.SetField(startingIndex++, item.QuestionId);
                dr.SetField(startingIndex++, item.AnswerOptionId);
                dr.SetField(startingIndex++, item.Answer);
                dr.SetField(startingIndex++, item.AnswerNumber);
                dt.Rows.Add(dr);

            }

            return dt;
        }


    }
}
