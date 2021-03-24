import { Form, Input, Select, Button, Row, Col, Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const layouts = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 24,
    },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */


const { Option } = Select;
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};

const Signin = () => {

    const [cities, setCities] = useState(cityData[provinceData[0]]);
    const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);

    const handleProvinceChange = value => {
        setCities(cityData[value]);
        setSecondCity(cityData[value][0]);
    };
    
    const onSecondCityChange = value => {
        setSecondCity(value);
    };

      
    const onFinish = (values) => {
        console.log(values);
    };
    
    return(
    <Row>
        <Col {...{md:8,lg:8,xl:8}}></Col>
        <Col {...{xs:24,sm:24,md:8,lg:8,lg:8}}>
        <div className="site-card-border-less-wrapper">
            <Card title="Sign-In" bordered={false} style={{ width: '100%' }}>
            <Form {...layouts} layout="vertical" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                
                <Form.Item
                    name={['user', 'email']}
                    label="Email"
                    rules={[
                        {
                        type: 'email',
                        },
                    ]}
                    tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                <Input />
                </Form.Item>

                <Form.Item
                    name={['user', 'name']}
                    label="Display name"
                    rules={[
                        {
                        required: true,
                        },
                    ]}
                    tooltip={{
                        title: 'Tooltip with customize icon',
                        icon: <InfoCircleOutlined />,
                    }}
                >
                <Input />
                </Form.Item>

                <Form.Item name={['user', 'website']} label="School">
                    <Select defaultValue={provinceData[0]} style={{ width: '100%' }} onChange={handleProvinceChange}>
                        {provinceData.map(province => (
                        <Option key={province}>{province}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name={['user', 'website']} label="Campus">
                    <Select defaultValue={provinceData[0]} style={{ width: '100%' }} onChange={handleProvinceChange}>
                        {provinceData.map(province => (
                        <Option key={province}>{province}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name={['user', 'website']} label="Offices">
                    <Select defaultValue={provinceData[0]} style={{ width: '100%' }} onChange={handleProvinceChange}>
                        {provinceData.map(province => (
                        <Option key={province}>{province}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layouts.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
            </Card>
        </div>
        </Col>
        <Col {...{md:8,lg:8,xl:8}}></Col>
    </Row>
    )
}

export default Signin;