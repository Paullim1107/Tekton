using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Requests.SurveysInstances;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/surveyInstances")]
    [ApiController]
    public class SurveyInstanceApiController : BaseApiController
    {
        private ISurveyInstanceService _service = null;
        private IAuthenticationService<int> _authService = null;


        public SurveyInstanceApiController(ISurveyInstanceService service
            , ILogger<SurveyInstanceApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> CreateSurveyInstance(SurveyInstanceAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.AddSurveyInstance(model,userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch(Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost("onSubmit")]
        public ActionResult<ItemResponse<int>> SurveySubmit(SurveyInstanceSubmitRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.SubmitSurveyInstance(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> UpdateInstance(SurveyInstanceUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                var result = _service.UpdateSurveyInstance(model, userId);


                if (result <= 0)
                {
                    throw new Exception("Record Not Found");
                }

                response = new SuccessResponse();
            }
            
            catch(Exception ex)
            {
                if(ex.Message == "Record Not Found")
                {
                    code = 404;
                    response = new ErrorResponse(ex.Message);
                }
                else
                {
                    code = 500;
                    response = new ErrorResponse(ex.Message);
                }
                
            }

            return StatusCode(code, response);
        }


        [HttpGet("instanceId/{id:int}")]
        public ActionResult<ItemResponse<SubmitSurveyInstance>> GetByInstanceId(int id)
        {
            int intCode = 200;
            BaseResponse response = null;

            try
            {
                SubmitSurveyInstance survey = _service.GetBySurveyInstanceId(id);

                if (survey == null)
                {
                    intCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<SubmitSurveyInstance> { Item = survey };
                }
            }
            catch (Exception ex)
            {
                intCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(intCode, response);
        }

        [HttpGet("surveyId/{id:int}")]
        public ActionResult<ItemResponse<SubmitSurveyInstance>> GetBySurveyId(int id)
        {
            int intCode = 200;
            BaseResponse response = null;

            try
            {
                SubmitSurveyInstance survey = _service.GetBySurveyId(id);

                if (survey == null)
                {
                    intCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<SubmitSurveyInstance> { Item = survey };
                }
            }
            catch (Exception ex)
            {
                intCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(intCode, response);
        }

        [HttpGet("takesurvey/{id:int}")]
        public ActionResult<ItemResponse<SurveyInstance>> GetBySurveyIdV2(int id)
        {
            int intCode = 200;
            BaseResponse response = null;

            try
            {
                SurveyInstance survey = _service.GetBySurveyIdV2(id);

                if (survey == null)
                {
                    intCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<SurveyInstance> { Item = survey };
                }
            }
            catch (Exception ex)
            {
                intCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(intCode, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<SubmitSurveyInstance>>> Pagination (int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<SubmitSurveyInstance> paged = _service.Pagination(pageIndex, pageSize);

                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<SubmitSurveyInstance>> response = new ItemResponse<Paged<SubmitSurveyInstance>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch(Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }



    }  

}
