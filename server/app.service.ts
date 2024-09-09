import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { AlibabaTongyiEmbeddings } from '@langchain/community/embeddings/alibaba_tongyi';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
// import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import path from 'path';
import xlsx from 'xlsx';

@Injectable()
export class AppService {
  private openai = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-afdcbcaa91a44f119f1e74373dff8c18', // 我自己的 sk-5e1b0a5d5a964045a01b18090bb93cc9
  });

  static LOAD_FIELDS = ['/业务类型', '/业务模块(标题名)'];

  private vectorStore: any = null;

  constructor() {
    this.init();
  }

  loadData() {
    const fileContent = xlsx.readFile(
      path.resolve(__dirname, '../../', './document_loaders/dbdata.xlsx'),
    );
    const name = fileContent.SheetNames[0];
    const sheet = fileContent.Sheets[name];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    return jsonData;
  }

  async init(fields?: any) {
    const jsonData = this.loadData();
    // JSON 文件加载器
    const loader = new JSONLoader(
      // path.resolve(__dirname, '../../', './document_loaders/init.json'),
      new Blob(
        [JSON.stringify(jsonData.map((i: any, j) => ({ ...i, id: j })))],
        {
          type: 'application/json',
        },
      ),
      fields ?? AppService.LOAD_FIELDS,
    );
    const docs = await loader.load();

    // PDF 文件加载器
    // const loader = new PDFLoader(
    //   path.resolve(
    //     __dirname,
    //     '../../',
    //     './document_loaders/魔数产品白皮书.pdf',
    //   ),
    // );
    // const docs = await loader.load();

    this.vectorStore = await Chroma.fromDocuments(
      docs,
      new AlibabaTongyiEmbeddings({
        apiKey: 'sk-afdcbcaa91a44f119f1e74373dff8c18',
        modelName: 'text-embedding-v2',
        // parameters: { text_type: 'query' },
      }),
      {
        // collectionName: 'moshu-db',
        url: 'http://localhost:8008',
        collectionMetadata: {
          'hnsw:space': 'cosine',
        },
      },
    );
  }

  async getColumns() {
    const jsonData = this.loadData();
    return Object.keys(jsonData?.[0]).map((key) => ({
      label: key,
      value: `/${key}`,
    }));
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

  async getVector(body: Record<string, any>) {
    const { search, fields } = body;
    await this.init(fields); // 重新生产数据
    const res = await this.vectorStore.similaritySearch(
      search || '魔数要怎么搭建大屏',
      5,
    );
    const jsonData = this.loadData();
    return res.map((item: any) => ({
      ...item,
      sourceLine:
        jsonData[
          Math.floor(
            (item.metadata.line - 1) /
              (fields.length || AppService.LOAD_FIELDS.length),
          )
        ],
    }));
  }
}
