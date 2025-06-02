
export class AIService {
  private openAIApiKey: string;
  private anthropicApiKey?: string;
  private googleApiKey?: string;

  constructor(openAIApiKey: string, anthropicApiKey?: string, googleApiKey?: string) {
    this.openAIApiKey = openAIApiKey;
    this.anthropicApiKey = anthropicApiKey;
    this.googleApiKey = googleApiKey;
  }

  async generate(feature: string, request: any) {
    console.log(`🤖 AI Service generating for feature: ${feature}`);
    
    // For now, use OpenAI as default
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: 'gpt-4o-mini',
      usage: data.usage
    };
  }
}
