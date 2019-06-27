import React, {useState, Fragment, useEffect} from 'react';
import {Card, Icon, Input, Modal} from 'antd';
import {Mutation, useMutation} from 'react-apollo-hooks';
import {gql} from 'apollo-boost';

const {Meta} = Card;

export default function AppContainer ({data, refetch}) {
    const menuItems = data.allMenuItems;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState('new');
    return (
        <div className='app-container'>
            <div className='app-background'></div>
            <div className='topbar'>
                <div style={{display: 'flex'}}>
                    <Input placeholder='search' onSearch={(value) => value}/>
                    <div className='topbar-icon' onClick={()=> {
                        setModalVisible(!modalVisible)
                        setModalType('new');
                        setModalData(null);
                    }}>
                        <Icon type='plus-circle' color='white'/>
                    </div>
                    <div className='topbar-icon' onClick={()=> refetch()}>
                        <Icon type='reload' color='white'/>
                    </div>
                </div>
            </div>
            <div className='menu-items'>
                {menuItems.map(menuItem => {
                    return(
                        <div className='menu-item' onClick={()=> {
                            setModalVisible(true);
                            setModalType('edit');
                            setModalData(menuItem);
                        }}>
                            <div className='menu-item-icons'>
                                <div className='menu-item-icon'>
                                    <Icon type='edit'/>
                                </div>
                            </div>
                        <Card
                            hoverable
                            cover={<div className='menu-item-img'><img alt={menuItem.name} src={menuItem.imageURL}/></div>}
                            >
                            <Meta title={menuItem.name} description={`$${menuItem.price}`}/>
                        </Card>
                        </div>
                    )
                })}
            </div>
            <MenuModal
                visible={[modalVisible, setModalVisible]}
                refetch={refetch}
                type={modalType}
                data={modalData}
            />
        </div>
    )
}

const MenuModal = ({visible, refetch,type, data}) => {
    const [modalVisible,setModalVisible] = visible;
    const [menuData, setMenuData] = useState({
        name: '',
        price: '',
        imageURL: ''
    })

    const addMenuItem = useMutation(NEW_MENU_ITEM, {
        variables: menuData
    })
    const updateMenuItem = useMutation(UPDATE_MENU_ITEM, {
        variables: menuData
    })

    useEffect(()=> {
        setMenuData(type === 'new' ? {
            name: '',
            price: '',
            imageURL: ''
        } : data)
    },[data]);

    return(
            <Modal
                title={type === 'edit' ? `Edit ${menuData.name}` : 'Add Menu Item'}
                visible={modalVisible}
                centered={true}
                onOk={()=> {
                    const newMenuItem = {...menuData, price: parseFloat(menuData.price)}
                    if(type === 'new')
                        addMenuItem({variables: newMenuItem})
                    if(type === 'edit')
                        updateMenuItem({variables: newMenuItem})
                    setModalVisible(false);
                    refetch();
                }}
                onCancel={() => setModalVisible(false)}>
                            <Fragment>
                                {menuData.imageURL !== '' &&
                                <img src={menuData.imageURL} alt='menu-item-preview'/>}
                                <Input
                                    placeholder='Dish Name'
                                    value={menuData.name}
                                    onChange={(e)=> setMenuData({...menuData, name: e.target.value})}
                                />
                                <Input
                                    placeholder='Price'
                                    value={menuData.price}
                                    addonBefore='$'
                                    onChange={(e)=> {
                                        setMenuData({...menuData, price: e.target.value})}}
                                />
                                <Input
                                    placeholder='Image URL'
                                    value={menuData.imageURL}
                                    onChange={(e)=> setMenuData({...menuData, imageURL: e.target.value})}
                                />
                            </Fragment>

                </Modal>)
}

const UPDATE_MENU_ITEM = gql`
    mutation updateMenuItemMutation($id: String, $name: String, $price: Float, $imageURL: String){
        updateMenuItem(id: $id, name: $name, price: $price, imageURL: $imageURL) {
            id
            name
            price
            imageURL
        }
    }
`

const NEW_MENU_ITEM = gql`
    mutation addMenuItemMutation($name: String, $price: Float, $imageURL: String) {
            addMenuItem(name: $name, price: $price, imageURL: $imageURL) {
                id
                name
                price
                imageURL
            }
        }
`

