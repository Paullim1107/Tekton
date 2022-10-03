import React, { useEffect, useState } from 'react';
import surveysService from '../../services/surveysService';
import debug from 'sabio-debug';
import SurveyAnswerCard from './SurveyAnswerCard';
import '../surveys/surveys.css';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';

const _logger = debug.extend('SurveyAnswers');

const SurveyAnswer = () => {
    const [pageData, setPageData] = useState({
        arrayOfSa: [],
        saComponents: [],
        paginate: {
            pageIndex: 0,
            pageSize: 4,
            totalCount: 30,
            totalPages: 10,
        },
    });

    const onPageChange = (pageNumber) => {
        setPageData((prevState) => {
            const currentPage = { ...prevState };

            currentPage.paginate.pageIndex = pageNumber - 1;

            return currentPage;
        });
    };

    useEffect(() => {
        surveysService
            .getAllSurveyAnswers(pageData.paginate.pageIndex, pageData.paginate.pageSize)
            .then(onGetSaSuccess)
            .catch(onGetSaError);
    }, [pageData.paginate.pageIndex]);

    const onGetSaSuccess = (response) => {
        let arrayOfAnswers = response.item.pagedItems;

        _logger(response.item);

        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.arrayOfSa = arrayOfAnswers;
            pd.saComponents = arrayOfAnswers && arrayOfAnswers.map(mapSurveyAnswers);
            pd.paginate.totalCount = response.item.totalCount;
            pd.paginate.totalPages = response.item.totalPages;

            _logger(pd);

            return pd;
        });
    };

    const onGetSaError = (err) => {
        _logger(err);
    };

    const mapSurveyAnswers = (aSurveyCard) => {
        return <SurveyAnswerCard card={aSurveyCard} key={`survey_${aSurveyCard.id}`} />;
    };

    return (
        <React.Fragment>
            <div className="survey-answer-banner banner text-center">
                <h1 className="sa-banner-text">Tekton Survey Answers</h1>
            </div>

            <div className="survey-answer-container">
                <div className="row sa-row">{pageData.saComponents}</div>
            </div>

            <Pagination
                className="text-center"
                onChange={onPageChange}
                current={pageData.paginate.pageIndex + 1}
                total={pageData.paginate.totalCount}
                pageSize={pageData.paginate.pageSize}
                locale={locale}
            />
            <br></br>
        </React.Fragment>
    );
};

export default SurveyAnswer;
