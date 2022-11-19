import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import {  toast } from 'material-react-toastify';

import { getError, BASE_URL } from '../utils';
import axios from 'axios';
import './profile.css';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
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

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [firstName, setFirstName] = useState(userInfo.firstName);
  const [lastName, setLastName] = useState(userInfo.lastName);
  const [mobileNumber, setMobileNumber] = useState(userInfo.mobileNumber);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [image, setImage] = useState(userInfo.image);
  const [images, setImages] = useState(userInfo.images);

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
    loading: true,
    error: '',
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/users/profile`,
        {
          firstName,
          lastName,
          mobileNumber,
          email,
          password,
          image,
          images
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
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

  return (
    <div className="container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <div className="container emp-profile">
            <form onSubmit={submitHandler}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-img">
                            <img src={image}
                            width="275"
                            height="183"
                            alt="test image"
                            onChange={(e) => setImage(e.target.value)}
                            />
                            <div className="file btn btn-lg btn-primary">
                                Change Photo
                                <input type="file" 
                                name="file"
                                onChange={uploadFileHandler}
                                />
                                {loadingUpload && <LoadingBox></LoadingBox>}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="profile-head">
                          <h5>{firstName} {lastName}</h5>
                          <h6>{userInfo.isActive ? 'Active' : 'In Active'}</h6>
                          <p className="proile-rating">PLAN : <span>Free</span></p>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-selected="true">About</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <input type="submit" 
                          className="profile-edit-btn" 
                          name="btnAddMore" 
                          value="Save"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-work">
                            <p>USER LOCATION</p>
                            <p className="proile-rating">COUNTY : <span>Nyeri</span></p>
                            <p className="proile-rating">SUB-COUNTY : <span>Othaya</span></p>
                            <p className="proile-rating">CENTER : <span>Iriaini</span></p>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="tab-content profile-tab" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>User Id</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{userInfo._id}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{userInfo.email}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Phone</label>
                                            </div>
                                            <div className="col-md-6">
                                              <p>{userInfo.mobileNumber}</p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>First Name</label>
                                            </div>
                                            <div className="col-md-6">
                                            <input type="text" 
                                              className="form-control" 
                                              onChange={(e) => setFirstName(e.target.value)} 
                                              value={firstName}
                                             />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Last Name</label>
                                            </div>
                                            <div className="col-md-6">
                                            <input type="text" 
                                              className="form-control"  
                                              value={lastName}
                                              onChange={(e) => setLastName(e.target.value)}
                                             />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Password</label>
                                            </div>
                                            <div className="col-md-6">
                                            <input type="password" 
                                              className="form-control"  
                                              onChange={(e) => setPassword(e.target.value)}
                                             />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Confirm Password</label>
                                            </div>
                                            <div className="col-md-6">
                                            <input type="password" 
                                              className="form-control"  
                                              onChange={(e) => setConfirmPassword(e.target.value)}
                                             />
                                            </div>
                                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>           
        </div>
      
    </div>
  );
}
