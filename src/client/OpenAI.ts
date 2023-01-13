import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export class OpenAIClient {
    config: Configuration
    client: OpenAIApi

    constructor() {
        this.config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.client = new OpenAIApi(this.config);
    }

    async searchByString(question:string) {
        return await this.client.createCompletion({
            model: "text-davinci-003",
            prompt: question,
            max_tokens: 70,
            temperature: 0.3,
            top_p: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.5,
        });

    }
}
