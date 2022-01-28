import { Modal, Form, Select, Spin, Avatar } from 'antd'
import { debounce } from 'lodash';
import React, { useContext, useMemo, useState } from 'react'
import { query, orderBy,where, collection, limit, getDocs, doc, updateDoc } from "firebase/firestore";  
import { AppContext } from '../../Context/AppProvider';
import { db } from '../../firebase/config';

function DebounceSelect({fetchOptions, curMembers, debounceTimeout = 300,...props}){

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) =>{
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then(newOptions =>{
                setOptions(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers])
    return(
        <Select 
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching?<Spin size='small' />:null}
            {...props}
        >
            {
                options.map(otp=> (
                    <Select.Option key={otp.value} value={otp.value} title={otp.title}>
                        <Avatar size='small' src={otp.photoURL}>
                            {otp.photoURL?'':otp.label?.charAt(0)?.toUpperCase()}
                        </Avatar>
                     {` ${otp.label}`}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

async function fetchUserList(search,curMembers){
    const collectionRef = query(collection(db, 'users'), where('keywords','array-contains',search?.toLowerCase()), orderBy('displayName'), limit(20));
 
    const docSnap = await getDocs(collectionRef);   
    return docSnap.docs.map(doc=>(
        {        
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
        }
    )).filter((otp)=> !curMembers.includes(otp.value));
}

export default function InviteMemberModal() {
    const {isInviteMemberVisible, setIsInviteMemberVisible, selectedRoom, selectedRoomId} = useContext(AppContext);
    
    const [value, setValue] = useState([])
    const [form] = Form.useForm();
    

    const handleOK = () =>{
    
        const roomRef = doc(db, 'rooms', selectedRoomId);
        updateDoc(roomRef, {
            members: [...selectedRoom.members, ...value.map((val) => val.value)],
          })
        
        form.resetFields();
        setValue([]);
        setIsInviteMemberVisible(false);
    }
    const handleCancel = () =>{
        form.resetFields();
        setIsInviteMemberVisible(false);
    }

    return (
        <div>
            <Modal 
                title='Mời thêm thành viên'
                visible={isInviteMemberVisible}
                onOk={handleOK}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <DebounceSelect 
                        mode='multiple'
                        label='Tên các thành viên'
                        value={value}
                        placeholder="Nhập tên thành viên"
                        fetchOptions={fetchUserList}
                        onChange={newvalue => setValue(newvalue)}
                        style={{width: '100%'}}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    )
}
