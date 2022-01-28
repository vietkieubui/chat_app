import React from 'react'
import {Row, Col, Button,Typography} from 'antd'
import {auth} from '../../firebase/config' 
import {signInWithPopup, FacebookAuthProvider, getAdditionalUserInfo, GoogleAuthProvider } from 'firebase/auth'
import { addDocument, generateKeywords } from '../../firebase/services'

import {FacebookOutlined, GoogleOutlined} from '@ant-design/icons';

const {Title} = Typography;


const fbProvider = new FacebookAuthProvider();
const ggProvider = new GoogleAuthProvider();

export default function Login() {

    const handleFbLogin = async () => {
        const data = await signInWithPopup(auth, fbProvider)
         
        if(getAdditionalUserInfo(data)?.isNewUser){
            const user = data.user;
            addDocument('users',{
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: getAdditionalUserInfo(data).providerId,
                keywords: generateKeywords(user.displayName)
            });
        }
    }

    const handleGoogleLogin = async () =>{
        const data = await signInWithPopup(auth, ggProvider)
        if(getAdditionalUserInfo(data)?.isNewUser){
            const user = data.user;
            addDocument('users',{
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: getAdditionalUserInfo(data).providerId,
                keywords: generateKeywords(user.displayName)
            });
        }

    }


    return (
        <div>
            <Row justify='center'style={{height: '800px'}}>
                <Col span={8}>
                    <Title style={{textAlign: 'center'}} level={3}>App Chat</Title>
                    <Button style={{width: '100%', marginBottom: 5}} onClick={handleGoogleLogin}>
                    <GoogleOutlined />Đăng nhập bằng Google
                    </Button>
                    <Button style={{width: '100%'}} onClick={handleFbLogin}>
                    <FacebookOutlined /> Đăng nhập bằng Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
