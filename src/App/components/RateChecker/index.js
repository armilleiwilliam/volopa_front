import {Row, Col, Typography, Card, Form, Input, Select, Space, Progress, Button} from 'antd'
import React, {createContext, useState} from "react";
import axios from "axios";
import Modal from './../Modal/index';
import {refreshToken} from "../Validation/refreshToken";

export const ModalDataContext = createContext(undefined);

export function RateChecker() {
    const [formAmounts, setFormAmounts] = useState({
        amount_to_exchange: '',
        amount_exchanged: '',
        currencyTo: '',
        currencyFrom: '',
        rate: '',
        error_title: '',
        error_message: ''
    });

    const [errors, setErrors] = useState({});

    // validate checker fields
    const formValidation = (formData) => {
        const {amount_to_exchange, currencyTo, currencyFrom} = formAmounts;
        const errors = {};
        if (!amount_to_exchange) errors.amount = "Field required";
        if (!currencyTo) errors.currencyTo = "Field required";
        if (!currencyFrom) errors.currencyFrom = "Field is required";
        return errors;
    };

    // update state on each field update
    const handleChange = (e) => {
        setFormAmounts({
            ...formAmounts,
            [e.target.name]: e.target.value,
            show_modal: false
        });
        let errors = formValidation(formAmounts);
        setErrors(errors);
    }

    // update setFormAmounts state on both "axios" and "interceptor response" code below
    const setFormValues = (response) => {
        if (response.data.message === "success") {
            let result = response.data.data;
            setFormAmounts({
                amount_to_exchange: result.amount_to_exchange,
                currencyFrom: result.from_currency,
                currencyTo: result.to_currency,
                amount_exchanged: result.amount_exchanged,
                rate: result.rate,
                show_modal: true,
                error_title: '',
                error_message: '',
            });
        } else {
            let resp = response.data.data;
            setFormAmounts({
                ...formAmounts,
                error_title: response.data.message,
                error_message: resp.amount ?? resp.from_currency ?? resp.to_currency,
                show_modal: true,
            });
        }
    }

    // Starts conversion
    const convertAmounts = async (e) => {
        e.preventDefault();
        const errors = formValidation(formAmounts);
        setErrors(errors);

        if (Object.keys(errors).length === 0) {

            let payload = {
                from_currency: formAmounts.currencyFrom,
                to_currency: formAmounts.currencyTo,
                amount: formAmounts.amount_to_exchange
            }

            axios.interceptors.request.use(
                (config) => {
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        config.headers["x-access-token"] = token;
                        config.headers["Authorization"] = `Bearer ${token}`;
                    }
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );

            // Api request to Laravel: amount conversion
            await axios.post(`${process.env.REACT_APP_LARAVEL_SITE}/exchange-rate`,
                payload
            ).then(response => {
                setFormValues(response);

            }).catch(err => {
                console.log(err);
            });

            // Response: interceptor
            axios.interceptors.response.use(
                (response) => {
                    setFormValues(response);
                },
                async (err) => {
                    const originalConfig = err.config;

                    if (err.response) {
                        // Access Token was expired
                        if (err.response.status === 401 && !originalConfig._retry) {
                            originalConfig._retry = true;

                            try {
                                const rs = await refreshToken();
                                const {accessToken} = rs.data;
                                window.localStorage.setItem("auth_token", accessToken);
                                axios.defaults.headers.common["x-access-token"] = accessToken;

                                return axios(originalConfig);
                            } catch (_error) {
                                if (_error.response && _error.response.data) {
                                    return Promise.reject(_error.response.data);
                                }

                                return Promise.reject(_error);
                            }
                        }
                        if (err.response.status === 403 && err.response.data) {
                            return Promise.reject(err.response.data);
                        }
                    }

                    return Promise.reject(err);
                }
            );

        }
    }


    return (
        <>
            <ModalDataContext.Provider value={formAmounts}>
                <Modal/>
            </ModalDataContext.Provider>
            <Row>
                <Col span={24}>
                    <Typography.Text className='dark-green medium fs-25px'>Rate Checker</Typography.Text>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Card>
                        <Card.Grid className='full-width rounded b-g hover-no-border'>
                            <Form layout='vertical' name='convertTo' onSubmitCapture={(e) => convertAmounts(e)}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item

                                            label={<span className='muli semi-bold fs-18px'>Convert To</span>}
                                        >
                                            <Row gutter={8} className="ml-3">
                                                <Col span={10} className="ml-3">
                                                    <Select
                                                        id="currencyTo"
                                                        name="currencyTo"
                                                        className='dark-green'
                                                        showSearch
                                                        onChange={(e) => setFormAmounts({
                                                            ...formAmounts,
                                                            show_modal: false,
                                                            currencyTo: e,
                                                            rate: ''
                                                        })}
                                                        filterOption={(input, option) => {
                                                            if (option.children)
                                                                return option.children.toLowerCase().includes(input.toLowerCase())
                                                            else if (option.label)
                                                                return option.label.toLowerCase().includes(input.toLowerCase())
                                                        }}>
                                                        <Select.OptGroup label='Common'>
                                                            <Select.Option value="GBP">GBP</Select.Option>
                                                            <Select.Option value="EUR">EUR</Select.Option>
                                                        </Select.OptGroup>
                                                        <Select.OptGroup label='Other'>
                                                            <Select.Option value="USD">USD</Select.Option>
                                                            <Select.Option value="AUD">AUD</Select.Option>
                                                        </Select.OptGroup>
                                                    </Select>
                                                    {Object.keys(errors).includes("currencyTo") && errors.currencyTo && (
                                                        <p className="text-red-300">{errors.currencyTo}</p>
                                                    )}
                                                </Col>
                                                <Col span={18}>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                        <Form.Item label={<span className='muli semi-bold fs-18px'>Convert From</span>}>
                                            <Row gutter={8}>
                                                <Col span={8}>
                                                    <Select
                                                        id="currencyFrom"
                                                        name="currencyFrom"
                                                        className='dark-green'
                                                        showSearch
                                                        onChange={(e) => setFormAmounts({
                                                            ...formAmounts,
                                                            show_modal: false,
                                                            currencyFrom: e,
                                                            rate: ''
                                                        })}
                                                        filterOption={(input, option) => {
                                                            if (option.children)
                                                                return option.children.toLowerCase().includes(input.toLowerCase())
                                                            else if (option.label)
                                                                return option.label.toLowerCase().includes(input.toLowerCase())
                                                        }}>
                                                        <Select.OptGroup label='Common'>
                                                            <Select.Option value="GBP">GBP</Select.Option>
                                                            <Select.Option value="EUR">EUR</Select.Option>
                                                        </Select.OptGroup>
                                                        <Select.OptGroup label='Other'>
                                                            <Select.Option value="USD">USD</Select.Option>
                                                            <Select.Option value="AUD">AUD</Select.Option>
                                                        </Select.OptGroup>
                                                    </Select>
                                                    {Object.keys(errors).includes("currencyFrom") && errors.currencyFrom && (
                                                        <p className="text-red-300">{errors.currencyFrom}</p>
                                                    )}
                                                </Col>
                                                <Col span={16}>
                                                    <Input placeholder='Enter Amount' name="amount_to_exchange"
                                                           id="amount_to_exchange"
                                                           value={formAmounts.amount_to_exchange}
                                                           onChange={handleChange}/>
                                                    {Object.keys(errors).includes("amount") && errors.amount && (
                                                        <p className="text-red-300">{errors.amount}</p>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row align='bottom'>
                                    <Col span={12}>
                                        {formAmounts.rate !== "" &&
                                            <Space>
                                                <Progress type='circle' percent={75} width={40} format={() => `30s`}/>
                                                <Space direction='vertical' size={0}>
                                                    <Typography.Text className='muli semi-bold light-green'>FX
                                                        Rate</Typography.Text>
                                                    <Typography.Text className='muli semi-bold light-green'>
                                                        1 {formAmounts.currencyFrom} = {formAmounts.rate} {formAmounts.currencyTo}</Typography.Text>
                                                </Space>
                                            </Space>
                                        }
                                    </Col>
                                    <Col span={12} className='right-align-text'>
                                        <Button type='primary' htmlType='submit'>Convert</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Grid>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
