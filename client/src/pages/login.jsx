import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';

//import login mutation//
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations'

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  //pass in login mutation //
  const [login] = useMutation(LOGIN_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if all form inputs are valid //
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const {data} = await login({
        variables:  {...userFormData }
      });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}
      >
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
        An error occured while trying to login to your account.
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email:</Form.Label>
          <Form.Control
            type='text'
            placeholder='email@email.com'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password:</Form.Label>
          <Form.Control
            type='password'
            placeholder='**********'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
            className="forminput"
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
        className="customBtn"
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
        >
          Login
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
