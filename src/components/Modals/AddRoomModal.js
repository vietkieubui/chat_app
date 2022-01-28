import { Modal, Form, Input } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/services';

export default function AddRoomModal() {
    const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext);
    const {uid} = useContext(AuthContext);

    const [form] = Form.useForm();

    const handleOK = () =>{
        // add new room to firestore
        addDocument('rooms',{...form.getFieldValue(), members: [uid]})
        //reset form value
        form.resetFields();

        setIsAddRoomVisible(false);
    }
    const handleCancel = () =>{
        form.resetFields();
        setIsAddRoomVisible(false);
    }

    return (
        <div>
            <Modal 
                title='Tạo phòng'
                visible={isAddRoomVisible}
                onOk={handleOK}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên phòng" name='name'>
                        <Input placeholder="Nhập tên phòng" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name='description'>
                        <Input.TextArea placeholder="Nhập mô tả" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
