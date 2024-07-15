import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AppService {
  private openai = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-5e1b0a5d5a964045a01b18090bb93cc9',
  });

  async getHello() {
    const stream = await this.openai.beta.chat.completions.stream({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: '你是个投资者，主要投资期货，黄金、原油、白银等。并保持着每天至少5%左右的收益率',
        },
        { role: 'user', content: '有哪些技术分析手段' },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }

    const chatCompletion = await stream.finalChatCompletion();
    console.log(chatCompletion.choices[0].message); // {id: "…", choices: […], …}
  }
}
