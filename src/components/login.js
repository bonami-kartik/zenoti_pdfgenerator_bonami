import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { Button, Card, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useAuth } from '../app/useAuth';
import { login } from '../api/api';
import { setItemInStorage } from '../utils/helper';
import { toastError, toastSuccess } from '../common/toast';

const defaultData = {
  username: "",
  password: ""
};

const Login = () => {
  const history = useHistory();
  const auth = useAuth();
  const { register, handleSubmit, errors } = useForm({ defaultValues: defaultData });
  const [loading, setLoading] = useState(false);

  const loginUser = (data) => {
    setLoading(true);
    login({ username: data.username, password: data.password })
      .then((res) => {
        const newData = {
          username: data.username,
        };
        if (res.token) newData.token = res.token;
        toastSuccess('Login successful.');
        setItemInStorage('user', newData);
        auth.setAuthUser(newData);
        auth.login();
        history.push('/');
      })
      .catch((err) => {
        if (err && err.message) {
          const msg = err.message === "Wrong username password combination" ? "Incorrect credentials" : err.message;
          toastError('Incorrect credentials.');
          setLoading(false);
        }
      });
  }

  return (
    <div className="login">
      <Card className="mx-auto">
        <Card.Body>
          <Form onSubmit={handleSubmit(loginUser)}>
            <FormGroup controlId="login-username">
              <FormLabel>User name</FormLabel>
              <FormControl
                ref={register({ required: 'User name is required' })}
                type="text"
                placeholder="Enter user name"
                name="username"
              />
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </FormGroup>

            <FormGroup controlId="login-password">
              <FormLabel>Password</FormLabel>
              <FormControl
                ref={register({ required: 'Password is required' })}
                type="password"
                placeholder="Enter password"
                name="password"
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </FormGroup>
            <div className="login-button-container">
              <Button disabled={loading} variant="primary" className="login-button" type="submit">Login</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
