import {Button, Card, Col, Form, Input, Row, Typography} from "antd";
import axios from "axios";
import {validateEmail} from "../../components/Validation";
import React, {useState} from "react";
import Modal from "../../components/Modal";
import {ModalDataContext} from "../../components/RateChecker";
import {Navigate} from "react-router-dom";

function Login() {

    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
    });

    const [errorsField, setErrorsField] = useState({});
    const [backEndErrorFrom, setBackEndErrorFrom] = useState({});

    const formValidation = (formFields) => {
        const {email, password} = formFields;
        const errors = {};
        if (!validateEmail(email)) errors.email = "Email not valid";
        if (!email) errors.email = "Field required";
        if (!password) errors.password = "Field required";
        return errors;
    };

    const handleChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value,
        });
    }

    const SubmitLogin = async (e) => {

        e.preventDefault();
        setBackEndErrorFrom({
            show_modal: false
        });
        const errors = formValidation(formFields);
        setErrorsField(errors);

        if (Object.keys(errorsField).length === 0) {
            let payload = {
                email: formFields.email,
                password: formFields.password,
            }
            await axios.post(`${process.env.REACT_APP_LARAVEL_SITE}/login`, payload)
                .then(resp => {
                    let response = resp.data.data;
                    if (resp.data.message == "success") {

                        // store password for refreshing the token
                        localStorage.setItem('email', formFields.email);
                        localStorage.setItem('password', formFields.password);

                        // store token
                        localStorage.setItem('auth_token', response.token);
                        const timeElapsed = Date.now();

                        // check when the token was stored to renews after one hour
                        localStorage.setItem('time_token_set', timeElapsed);

                        // redirect to dashboard once login completed
                        window.location.href = "/admin/dashboard";
                    }
                }).catch(err => {
                    setBackEndErrorFrom({
                        error_message: err.response.data.message,
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
                                        label={<span className="muli semi-bold m-l-20 m-r-15">Email</span>}
                                        name='email'

                                    >
                                        <Input value={formFields.email} name="email" id="email"
                                               onChange={(e) => handleChange(e)}/>
                                        {Object.keys(errorsField).includes("email") && errorsField.email && (
                                            <span className="text-red-300">{errorsField.email}</span>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="muli semi-bold">Password</span>}
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