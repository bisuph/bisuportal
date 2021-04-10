import { auth, db } from '@/services/firebase';
import { List, Avatar, Button, Space, Typography, Tag, Divider, Card, Skeleton } from 'antd';
import React, { useState, useEffect,useContext } from 'react';
import { UploadOutlined, FolderOpenOutlined, TwitterOutlined, PaperClipOutlined } from '@ant-design/icons';
import { isDynamicRoute } from 'next/dist/next-server/lib/router/utils';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;



const ListOfMemo = ({...props}) => {
    const {state,setState} = props

    const { initLoading, loading, list } = state;

    const IconText = ({ icon, text }) => (
      <Space>
        {React.createElement(icon)}
        {text}
      </Space>
    );

    return(
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          pagination={{
            onChange: page => {
            },
            pageSize: 10,
          }}
          dataSource={list}
          renderItem={(item,i) => {
            const {files} = item

          const forAction = []
          if(files){
              files.map((val) => {
                forAction.push(<a href={val.url}><PaperClipOutlined /> {val.name}</a>)
              })
          }

          return (
            <List.Item
                // actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Bohol_Island_State_University.png/200px-Bohol_Island_State_University.png" />
                    }
                    title={<a href="https://ant.design">{item.description}</a>}
                    description={`Uploaded by : ${item.uploader} |  Campus : ${item.campus} | Office : ${item.offices}`}
                  />
                  <div>
                  {files.map((val) => {
                    return(<a href={val.url} target="_blank"><PaperClipOutlined /> {val.name}</a>)
                  })}
                  </div>
                </Skeleton>
              </List.Item>
          )
        }}
      />
    )
}

export default ListOfMemo;