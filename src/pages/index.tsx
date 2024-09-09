import { Button, Input, message, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');
  const [list, setList] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    axios.post('/api/columns').then((res: any) => setList(res.data));
  }, []);

  return (
    <div>
      {/* <Button onClick={() => axios.post('/api/chat')}>发送</Button>
      <Button onClick={() => axios.post('/api/vector/set')}>
        创建嵌入向量
      </Button> */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300, marginRight: 12 }}
      />
      <Button
        type="primary"
        onClick={() => {
          if (fields.length === 0) {
            message.error('请先选择查询字段');
            return;
          }
          if (!search) {
            message.error('请输入查询关键词');
            return;
          }
          axios
            .post('/api/vector/get', { search, fields })
            .then((res) => setResult(res.data));
        }}
      >
        获取嵌入向量
      </Button>
      <Select
        mode="multiple"
        maxTagCount={1}
        style={{ width: 200, marginLeft: 12 }}
        options={list}
        value={fields}
        onChange={setFields}
      />
      <div style={{ whiteSpace: 'pre' }}>{JSON.stringify(result, null, 2)}</div>
    </div>
  );
}
