import * as React from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

import Stack from '@mui/material/Stack';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { useContext, useEffect, useReducer, useState } from 'react';
import { Link as ReactRouterLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'material-react-toastify';

import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';

// shiet
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import { formatDistance } from 'date-fns';

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

  const [image, setImage] = useState('');
  const [images, setImages] = useState(userInfo.images);

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
        setImage(data.image);
        setImages(data.images);
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
          image,
          images,
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

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post(`${BASE_URL}/api/upload`, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };

  // New stuff
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="xl" style={{ background: '#f5f5f5' }}>
      {/* style={{ background: '#f5f5f5' }} */}
      <Helmet>
        <title>Edit Survey {name}</title>
      </Helmet>
          {loadingUpdate && <Box paddingY={1}><LoadingBox></LoadingBox></Box>}
          {loading ? (
            <Box paddingY={1}><LoadingBox></LoadingBox></Box>
          ) : error ? (
            <Box paddingY={1}>
              <MessageBox severity="error">{error}</MessageBox>
            </Box>
          ) : (
            <>
              <Box paddingY={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {/* Properties */}
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        General settings
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>Editing - {name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <InputLabel htmlFor="name">Tool  Name</InputLabel>
                            <TextField
                              autoComplete="tool-name"
                              name="name"
                              required
                              fullWidth
                              id="name"
                              autoFocus
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <InputLabel htmlFor="slug">Slug</InputLabel>
                            <TextField
                              required
                              disabled
                              fullWidth
                              id="slug"
                              name="slug"
                              autoComplete="tool-slug"
                              value={slug}
                              onChange={(e) => setSlug(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel htmlFor="category">Category</InputLabel>
                            <TextField
                              required
                              fullWidth
                              id="category"
                              name="category"
                              autoComplete="tool-category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <InputLabel htmlFor="surveyJson">Survey Design Settings</InputLabel>
                            <TextField
                              required
                              disabled
                              fullWidth
                              id="surveyJson"
                              name="surveyJson"
                              autoComplete="surveyJson"
                              value={surveyJson}
                              onChange={(e) => setSurveyJson(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <InputLabel htmlFor="description">Tool description</InputLabel>
                            <TextField
                              required
                              fullWidth
                              id="description"
                              name="description"
                              autoComplete="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <InputLabel htmlFor="isActive">Tool Status</InputLabel>
                            <Checkbox
                              id="isActive"
                              color="success"
                              checked={isActive}
                              onChange={(e) => setIsActive(e.target.checked)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Grid item xs={12} sm={6}>
                              <InputLabel htmlFor="isActive">Tool Media</InputLabel>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <IconButton disabled={loadingUpload} color="success" aria-label="upload picture" component="label">
                                  <input hidden accept="image/*" type="file" onChange={uploadFileHandler} />
                                  <PhotoCamera />
                                </IconButton>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <Card sx={{ maxWidth: 345 }} elevation={1}>
                              <CardMedia
                                component="img"
                                height="140"
                                image={image}
                                alt={name}
                              />
                            {loadingUpload && <LoadingBox></LoadingBox>}
                            </Card>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="success"
                              sx={{ mt: 3, mb: 2 }}
                              disabled={loadingUpdate}
                            >
                              Update
                            </Button>
                          </Grid>

                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
              </Box>
              {/* cards */}
              <Box paddingY={2}>
                <SurveyCreatorComponent creator={creator} />
              </Box>
            </>
          )}
    </Container>
  );
}