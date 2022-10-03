import React, { useState, useEffect } from 'react';
import surveysService from '../../services/surveysService';
import debug from 'sabio-debug';
import { Card, Row, Col } from 'react-bootstrap';
import '../surveys/surveys.css';
import toastr from 'toastr';
import { Formik, Form, Field, FieldArray } from 'formik';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const _logger = debug.extend('SurveyTaker');

const questionTypes = {
    openAnswer: 1,
    mcSelectOne: 2,
    mcSelectMany: 3,
    matrixOne: 4,
    matrixMany: 5,
    likertFive: 6,
    likertSeven: 7,
    yesNo: 8,
    boolean: 9,
};

const SurveyTaker = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [pageData, setPageData] = useState({
        qComponents: [],
        qAnswers: [],
    });

    _logger(id);

    const [surveyName, setSurveyName] = useState([]);
    const [surveyId, setSurveyId] = useState();

    useEffect(() => {
        surveysService.getSurvey(id).then(onGetSurveySuccess).catch(onGetSurveyError);
    }, []);

    const onGetSurveySuccess = (response) => {
        let arrOfQuestions = response.item.surveyQuestionAnswer;

        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.qComponents = arrOfQuestions;

            return pd;
        });

        setSurveyName(response.item.survey.name);
        setSurveyId(response.item.id);
    };

    const onGetSurveyError = (err) => {
        _logger(err);
    };

    const mapQuestions = () => (question, index) => {
        const questionObj = pageData.qComponents[index];
        const mapCheckbox = (answer) => {
            return (
                <div key={`${questionObj.question}-${answer.text || answer.value}`}>
                    <label>
                        <Field
                            type="checkbox"
                            name={`batchSurveys[${index}].id`}
                            value={`${Number(answer.id)}`}
                            className="form-check-input"
                        />{' '}
                        {answer.text ? answer.text : answer.value}
                    </label>
                </div>
            );
        };
        const mapRadio = (answer) => {
            return (
                <div key={`${questionObj.question}-${answer.text || answer.value}`}>
                    <label>
                        <Field
                            type="radio"
                            name={`batchSurveys[${index}].id`}
                            value={`${Number(answer.id)}`}
                            className="form-check-input"
                        />{' '}
                        {answer.text ? answer.text : answer.value}
                    </label>
                </div>
            );
        };

        if (questionObj.questionTypeId === questionTypes.openAnswer) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <Field
                                        as="textarea"
                                        name={`batchSurveys[${index}].answer`}
                                        value={question.answer}
                                        className="form-control"
                                    />
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.mcSelectOne) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="form-check" key={questionObj.questionId}>
                                        {questionObj.answerOptions.map(mapRadio)}
                                    </div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.mcSelectMany) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="col">{questionObj.answerOptions.map(mapCheckbox)}</div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.matrixOne) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="form-check" key={questionObj.questionId}>
                                        {questionObj.answerOptions.map(mapRadio)}
                                    </div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.matrixMany) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="col">{questionObj.answerOptions.map(mapCheckbox)}</div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.likertFive) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="form-check" key={questionObj.questionId}>
                                        {questionObj.answerOptions.map(mapRadio)}
                                    </div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.likertSeven) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="form-check" key={questionObj.questionId}>
                                        {questionObj.answerOptions.map(mapRadio)}
                                    </div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.boolean) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="form-check" key={questionObj.questionId}>
                                        {questionObj.answerOptions.map(mapRadio)}
                                    </div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        } else if (questionObj.questionTypeId === questionTypes.yesNo) {
            return (
                <Card className="col-lg-5 col-md-8 col-sm-8 col-xl-8 bg-light border-start border-4 border-info mx-auto my-3">
                    <Card.Body className="shadow-lg bg-light">
                        <Row>
                            <Col>
                                <div key={questionObj.questionId}>
                                    <h4>{questionObj.question}</h4>
                                    <div className="form-check" key={questionObj.questionId}>
                                        {questionObj.answerOptions.map(mapRadio)}
                                    </div>
                                    <hr />
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        }
    };

    const onSubmitClicked = (data) => {
        const answers = data.batchSurveys;

        const convertAObj = (answers) => {
            const qArrayTemplate = (answerOption) => {
                let newArr = { ...answerOption };
                if (!Array.isArray(answerOption.id)) {
                    newArr.id = [answerOption.id];
                }
                return newArr;
            };
            const optIdTypeChanged = answers.map(qArrayTemplate);
            const optIdSplitArray = optIdTypeChanged.reduce((acc, cur) => {
                cur.id.forEach((optId) =>
                    acc.push({
                        questionId: cur.questionId,
                        answerOptionId: optId,
                        answer: cur.answer,
                        answerNumber: cur.answerNumber,
                    })
                );
                return acc;
            }, []);
            return optIdSplitArray;
        };
        const arryOnSubmit = convertAObj(answers);
        data.batchSurveys = arryOnSubmit;

        surveysService.submitSurvey(data).then(onSubmitSurveySuccess).catch(onSubmitSurveyError);
    };

    const onSubmitSurveySuccess = () => {
        Swal.fire({
            icon: 'success',
            title: 'Congratulations!',
            text: 'You have successfully submitted a Survey!',
        }).then(() => {
            navigate('/');
        });
    };

    const onSubmitSurveyError = (err) => {
        _logger(err);
        toastr.error('There was a problem trying to submit your Survey. Please try again.');
    };

    return (
        <>
            <div className="card border-success ">
                <h1 className="text-center">{surveyName}</h1>

                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        surveyId: surveyId,
                        statusId: 1, //Hard Coded because surveys are active
                        batchSurveys: pageData.qComponents.map((question) => {
                            let ques = {
                                questionId: question.id,
                                id: undefined,
                                answer: undefined,
                                answerNumber: undefined,
                            };
                            return ques;
                        }),
                    }}
                    onSubmit={onSubmitClicked}>
                    {({ values }) => (
                        <Form>
                            <FieldArray name="answersList" value={values.answersList}>
                                <div>{values.batchSurveys.map(mapQuestions(values))}</div>
                            </FieldArray>
                            <div className="card-body text-dark text-center">
                                <button type="submit" className="btn btn-info text-right">
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default SurveyTaker;
