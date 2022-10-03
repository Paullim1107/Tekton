import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import '../surveys/surveys.css';
import { useNavigate } from 'react-router-dom';

const _logger = debug.extend('SurveyAnswerCard');

function SurveyAnswerCard(props) {
    const surveyCard = props.card;
    const navigate = useNavigate();
    false && _logger(surveyCard);
    const newDate = new Date(surveyCard.dateCreated).toDateString();

    const onImgClicked = () => {
        const state = { payload: surveyCard, type: 'SURVEY' };

        navigate(`/surveyanswerresult/${surveyCard.id}`, { state });
    };

    const [mapSqa, updateMapSqa] = useState({ sqa: [] });

    useEffect(() => {
        updateMapSqa((prevState) => {
            const pd = { ...prevState };
            pd.sqa = surveyCard.surveyQuestionAnswer.map(mapQuestionCount);

            return pd;
        });
    }, []);

    const mapQuestionCount = (qa) => {
        let count = 0;
        if (qa) {
            count++;
        }
        return count;
    };

    let count = mapSqa.sqa.length;

    return (
        <div className="col-md-8 col-sm-12 sa-column">
            <Card className="shadow-lg survey-ac-overflow">
                <Row className="g-0 align-items-center survey-answer-card">
                    <Col md={2}>
                        <Card.Img
                            className="img-fluid survey-answer-card-img "
                            src={surveyCard.survey.companyLogo}
                            onClick={onImgClicked}
                        />
                    </Col>

                    <Card.Body className="survey-answer-card-body">
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
                        {/* Id:{surveyCard.id} */}
                        <br></br>
                        Survey Type: {surveyCard.survey.surveyType.name}
                        <br></br>
                        Question Count: {count}
                        <Card.Footer>
                            <small className="survey-answer-footer">
                                <span>Submitted:{newDate}</span>
                            </small>
                        </Card.Footer>
                    </Card.Body>
                </Row>
            </Card>
        </div>
    );
}

SurveyAnswerCard.propTypes = {
    card: PropTypes.shape({
        dateCreated: PropTypes.string,
        id: PropTypes.number,
        survey: PropTypes.shape({
            id: PropTypes.number,
            companyLogo: PropTypes.string,
            name: PropTypes.string,
            surveyType: PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            }),
        }),
        surveyQuestionAnswer: PropTypes.arrayOf(
            PropTypes.shape({
                question: PropTypes.string,
                answer: PropTypes.string,
                answerId: PropTypes.number,
            })
        ),
        user: PropTypes.shape({
            email: PropTypes.string,
        }),
        userProfile: PropTypes.shape({
            avatarUrl: PropTypes.string,
            firstName: PropTypes.string,
            mi: PropTypes.string,
            lastName: PropTypes.string,
        }),
    }),
};

export default SurveyAnswerCard;
