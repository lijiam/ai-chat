import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
// import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { AlibabaTongyiEmbeddings } from '@langchain/community/embeddings/alibaba_tongyi';
// import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import path from 'path';

@Injectable()
export class AppService {
  private openai = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-afdcbcaa91a44f119f1e74373dff8c18', // 我自己的 sk-5e1b0a5d5a964045a01b18090bb93cc9
  });

  private vectorStore: any = null;

  constructor() {
    this.init();
  }

  async init() {
    // JSON 文件加载器
    // const loader = new JSONLoader(
    //   path.resolve(__dirname, '../../', './document_loaders/init.json'),
    //   ['/questions', '/answers'],
    // );
    // const docs = await loader.load();

    const loader = new PDFLoader(
      path.resolve(
        __dirname,
        '../../',
        './document_loaders/魔数产品白皮书.pdf',
      ),
    );
    const docs = await loader.load();

    this.vectorStore = await Chroma.fromDocuments(
      docs,
      new AlibabaTongyiEmbeddings({
        apiKey: 'sk-afdcbcaa91a44f119f1e74373dff8c18',
        modelName: 'text-embedding-v2',
        parameters: { text_type: 'query' },
      }),
      {
        collectionName: 'ms-db',
        url: 'http://localhost:8008',
        collectionMetadata: {
          'hnsw:space': 'cosine',
        },
      },
    );
  }
  async getHello() {
    const stream = await this.openai.beta.chat.completions.stream({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content:
            '你是个投资者，主要投资期货，黄金、原油、白银等。并保持着每天至少5%左右的收益率',
        },
        { role: 'user', content: '有哪些技术分析手段' },
      ],
      stream: true,
    });

    // 流式输出
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }

    const chatCompletion = await stream.finalChatCompletion();

    return chatCompletion.choices[0].message;
  }

  async setVector() {
    // TODO
    return true;
  }

  async getVector(val: string) {
    return await this.vectorStore.similaritySearch(
      val || '魔数要怎么搭建大屏',
      5,
    );
  }
}
