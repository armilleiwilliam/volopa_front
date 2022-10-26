import {Button, Card, Col, Form, Input, Row, Typography} from "antd";
import axios from "axios";
import {validateEmail} from "../../components/Validation";
import React, {useState} from "react";
import Modal from "../../components/Modal";
import {ModalDataContext} from "../../components/RateChecker";

function Login() {

    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });

    const [errorsField, setErrorsField] = useState({});
    const [backEndErrorFrom, setBackEndErrorFrom] = useState({});

    // validate fields before submitting
    const formValidation = (formFields) => {
        const {email, password} = formFields;
        const errors = {};
        if (!validateEmail(email)) errors.email = "Email not valid";
        if (!email) errors.email = "Field required";
        if (!password) errors.password = "Field required";
        return errors;
    };

    // Update state each field update
    const handleChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value,
        });
    }

    // Login
    const SubmitLogin = async (e) => {

        e.preventDefault();

        // reset modal show staate
        setBackEndErrorFrom({
            show_modal: false
        });

        // fields validation
        const errors = formValidation(formFields);
        setErrorsField(errors);

        // if no front validation errors proceed with submitting the login request
        if (Object.keys(errorsField).length === 0) {
            let payload = {
                email: formFields.email,
                password: formFields.password,
            }
            await axios.post(`${process.env.REACT_APP_LARAVEL_SITE}/login`, payload)
                .then(resp => {
                    let response = resp.data.data;
                    if (resp.data.message === "success") {

                        // store password for refreshing the token
                        localStorage.setItem('email', formFields.email);
                        localStorage.setItem('password', formFields.password);

                        // store token
                        localStorage.setItem('auth_token', response.token);

                        // redirect to dashboard once login completed
                        window.location.href = "/admin/dashboard";
                    } else {

                    }
                }).catch(err => {

                    // process server validation and connection errors
                    var ErrorMessage = "An error has occured please try again or contact customer service";
                    if (typeof err.response !== "undefined" && err.response.data.message) {
                        ErrorMessage = err.response.data.message;
                    } else {
                        ErrorMessage = err.message === "Network Error" ? err.message + ". Please, check your connection to back end app." : err.message;
                    }

                    setBackEndErrorFrom({
                        error_message: ErrorMessage,
                        error_title: 'Check the following',
                        show_modal: true,
                    });
                });
        }
    }

    return (
        <Row className="full-height" align="middle" justify="center">

            <ModalDataContext.Provider value={backEndErrorFrom}>
                <Modal/>
            </ModalDataContext.Provider>
            <Col xxl={6} xl={9} lg={12} md={12} sm={18} xs={22}>
                <Card>
                    <Card.Grid className="full-width rounded">
                        <Row>
                            <Col span={24}>
                                <Typography.Text className="medium fs-28px dark-green">Login</Typography.Text>
                            </Col>
                        </Row>
                        <Row className="m-t-10">
                            <Col span={24}>
                                <Form
                                    layout="vertical"
                                    requiredMark={false}
                                    onSubmitCapture={(e) => SubmitLogin(e)}
                                >
                                    <Form.Item
                                        label={<span className="muli semi-bold m-l-20 m-r-20">Email</span>}
                                        name='email'

                                    >
                                        <Input value={formFields.email} name="email" id="email"
                                               onChange={(e) => handleChange(e)}/>
                                        {Object.keys(errorsField).includes("email") && errorsField.email && (
                                            <span className="text-red-300">{errorsField.email}</span>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="muli semi-bold m-r-15">Password</span>}
                                        name='password'>
                                        <Input.Password value={formFields.password} name="password" id="password"
                                                        onChange={(e) => handleChange(e)}/>
                                        {Object.keys(errorsField).includes("password") && errorsField.password && (
                                            <p className="text-red-300">{errorsField.password}</p>
                                        )}
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" className="right-align-text">Login</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Grid>
                </Card>
            </Col>
        </Row>
    );
}

export default Login;