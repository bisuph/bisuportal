import { Button, Form, Input, message, Modal, Space } from "antd"
import { useContext, useEffect, useState } from "react"
import {
    InfoCircleOutlined
} from '@ant-design/icons';
import { auth, fire } from "../../../services/firebase";
import { AccountContext } from "../../../context/AccountContext";

export default function PasswordConfirm ({open,setClose,afterResult}) {
    const {account} = useContext(AccountContext)
    const [form] = Form.useForm(); 
    const [visible,setVisble] = useState(false)

    useEffect(()=>{
        if(open !== null){
            setVisble(true)
        }
    },[open])

    const hideModal = () => {
        setClose(null)
        setVisble(false)
    }

    

    const handleOk = (values) => {
        var user = fire.auth().currentUser;
        var credentials = auth.EmailAuthProvider.credential(account?.email, values.password);
        user.reauthenticateWithCredential(credentials).then(function(values){
            console.log(values)
            message.success('Verification confirm')
            setClose(false)
            setVisble(false)
            afterResult(open)
        }).catch((error)=>{
            message.error(error.message)
        });
    }
    
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
        required: 'Password is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    return (
        <Modal
        title="Password Authentication"
        visible={visible}
        okText='Confirm'
        cancelText="Cancel"
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        closable={false}
        >
            <Form form={form} {...layouts}  layout="vertical" name="nest-messages" onFinish={handleOk} validateMessages={validateMessages}>
                
                <Form.Item
                    name={'password'}
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
                <Input size={'large'} autoComplete={'off'} type='password'/>
                </Form.Item>
                
                <Form.Item wrapperCol={{ ...layouts.wrapperCol}}>
                    
                <Space direction='vertical' style={{width:'100%'}}>
                    
                    <Button type="primary" htmlType="submit"  style={{width:'100%'}}>
                        Submit
                    </Button>
                    <Button onClick={()=>hideModal()} style={{width:'100%'}}>
                        Cancel
                    </Button>

                </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}