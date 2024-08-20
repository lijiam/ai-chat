import { Button, Input } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');

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
        onClick={() =>
          axios
            .post('/api/vector/get', { search })
            .then((res) => setResult(res.data))
        }
      >
        获取嵌入向量
      </Button>
      <div style={{ whiteSpace: 'pre' }}>{JSON.stringify(result, null, 2)}</div>
    </div>
  );
}
