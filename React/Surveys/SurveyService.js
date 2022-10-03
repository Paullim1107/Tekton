

const getAllSurveyAnswers = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${instanceEndpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getSurvey = (id) => {
    const config = {
        method: 'GET',
        url: `${instanceEndpoint}/takesurvey/${id}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json/' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const submitSurvey = (payload) => {
    const config = {
        method: 'POST',
        url: `${instanceEndpoint}/onSubmit`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json/' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const surveysService = {
    getAllSurveyAnswers,
    getSurvey,
    submitSurvey,
};
export default surveysService;
