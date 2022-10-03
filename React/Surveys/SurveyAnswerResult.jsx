import React, { useEffect, useState } from 'react';
import debug from 'sabio-debug';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Table } from 'react-bootstrap';
import '../surveys/surveys.css';

const _logger = debug.extend('SurveyAnswerResult');
function SurveyAnswerResult() {
    const { state } = useLocation();
    _logger(state);
    const navigate = useNavigate();
    const surveyCard = state.payload;
    const newDate = new Date(surveyCard.dateCreated).toDateString();

    const [mappedSurveyAnswers, updateMappedSurveyAnswers] = useState({
        surveyResult: [],
        surveyQuestions: [],
        surveyAnswers: [],
    });

    useEffect(() => {
        updateMappedSurveyAnswers((prevState) => {
            const pd = { ...prevState };
            _logger(pd);
            pd.surveyResult =
                surveyCard.surveyQuestionAnswer && surveyCard.surveyQuestionAnswer.map(mapSurveyQuestionAnswer);

            pd.surveyQuestions = pd.surveyResult.map(mapQuestion);
            pd.surveyAnswers = pd.surveyResult.map(mapQAnswer);
            return pd;
        });
    }, [state.payload]);

    const mapSurveyQuestionAnswer = (surveyObj) => {
        const qaObj = {};

        if (!surveyCard.surveyQuestionAnswer.question) {
            qaObj.question = surveyObj.question;
            qaObj.answer = surveyObj.answer;
            qaObj.id = surveyObj.id;
        }
        return qaObj;
    };

    const mapQuestion = (questionAnswerObj, idx) => {
        _logger(questionAnswerObj);

        return (
            <div key={`${questionAnswerObj.id}-Q-${idx}`}>
                <p className="qa-result"> {questionAnswerObj.question}</p>
            </div>
        );
    };

    const mapQAnswer = (questionAnswerObj, idx) => {
        _logger(idx);

        return (
            <div key={`${questionAnswerObj.id}-A-${idx}`}>
                <p className="qa-result"> {questionAnswerObj.answer}</p>
            </div>
        );
    };

    const onBackClick = () => {
        navigate(`/surveyanswers`);
    };

    return (
        <>
            <div className="survey-answer-banner banner text-center">
                <h1 className="text-center sa-banner-text">Survey Overview</h1>
            </div>
            <button type="button" className="btn btn-primary sa-result-btn" onClick={onBackClick}>
                Back
            </button>
            <Card className="shadow-lg survey-ac-overflow">
                <Row className="g-0 align-items-left survey-answer-card">
                    <Col md={1}>
                        <Card.Img
                            className="img-fluid survey-answer-profile-img"
                            src={surveyCard.userProfile.avatarUrl}
                        />
                    </Col>

                    <Card.Body className="survey-answer-result-body">
                        <Card.Title as="h5">{surveyCard.survey.name}</Card.Title>

                        <Card.Text>
                            <small className="text-muted survey-answer-card-text">
                                <span>
                                    Name:
                                    {`${surveyCard.userProfile.firstName} ${
                                        surveyCard.userProfile.mi.length < 1 ? '' : surveyCard.userProfile.mi
                                    } ${surveyCard.userProfile.lastName}`}
                                    <br></br>
                                    Email:{surveyCard.user.email}
                                </span>
                            </small>
                        </Card.Text>
                    </Card.Body>
                </Row>
            </Card>

            <Card>
                <Card.Body className="sa-table-result">
                    <h3 className="header-title">Submitted:{newDate}</h3>

                    <Table className="mb-0">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedSurveyAnswers.surveyResult.map((tableData, index) => {
                                return (
                                    <tr key={`I-${index}`}>
                                        <td>{tableData.question}</td>
                                        <td>{tableData.answer}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
}

export default SurveyAnswerResult;
