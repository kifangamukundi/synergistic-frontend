import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError, BASE_URL } from '../utils';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';

// Tools imports
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";

// Languages
import { surveyLocalization } from "survey-core";
//Limited the number of showing locales in survey.locale property editor
surveyLocalization.supportedLocales = ["en", "de", "es", "fr"];

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
// Introducing the tool creator in the edit environment
const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  showTranslationTab: true,
  showEmbeddedSurveyTab: true
};
export default function SurveyEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /survey/:id
  const { id: surveyId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

// In the future remember to add survey status for better usage and management

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [surveyJson, setSurveyJson] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${BASE_URL}/api/surveys/${surveyId}`);
        setName(data.name);
        setSlug(data.slug);
        setIsActive(data.isActive);
        setCategory(data.category);
        setDescription(data.description);
        setSurveyJson(data.surveyJson);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [surveyId]);

  // Tool at work
  const creator = new SurveyCreator(creatorOptions);
  // This removes the license
  creator.haveCommercialLicense = true;
  // Automatically save survey definition on changing. Hide "Save" button
  creator.isAutoSave = false;
  // Show state button here
  creator.showState = true;

  creator.JSON = surveyJson;
  creator.saveSurveyFunc = (saveNo, callback) => { 
    callback(saveNo, true);
    setSurveyJson(creator.JSON);
    console.log(creator.text);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${BASE_URL}/api/surveys/${surveyId}`,
        {
          _id: surveyId,
          name,
          slug,
          isActive,
          category,
          description,
          surveyJson,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Survey updated successfully');
      navigate('/survey/list');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  return (
    <div>
      <Row>
        <Col>
          <Helmet>
            <title>Edit Survey {surveyId}</title>
          </Helmet>
          <h1>Editing - {name}</h1>
        </Col>
      <div>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
          <Col className="col text-end">
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Other Properties And Save</Accordion.Header>
                    <Accordion.Body>
                      <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-2" controlId="name">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="slug">
                          <Form.Label>Slug</Form.Label>
                          <Form.Control
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="category">
                          <Form.Label>Category</Form.Label>
                          <Form.Control
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="description">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="surveyJson">
                          <Form.Label>Survey Schema Json</Form.Label>
                          <Form.Control
                            value={surveyJson}
                            onChange={(e) => setSurveyJson(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Check
                          className="mb-3"
                          type="checkbox"
                          id="isActive"
                          label="isActive"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                        />
                        <div className="mb-2">
                          <Button 
                            disabled={loadingUpdate} 
                            type="submit"
                            variant="success"
                          >
                            Save
                          </Button>
                          {loadingUpdate && <LoadingBox></LoadingBox>}
                        </div>
                      </Form>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
          </Col>
          )}
        </div>
      </Row>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
