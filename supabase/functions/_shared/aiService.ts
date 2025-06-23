
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
    
    // Try to get the configured model for this feature from database
    let modelConfig = await this.getModelConfigForFeature(feature);
    
    if (!modelConfig) {
      // Fallback to default OpenAI model
      modelConfig = {
        provider: 'openai',
        model_id: 'gpt-4o-mini'
      };
    }

    console.log(`🎯 Using model: ${modelConfig.model_id} from ${modelConfig.provider}`);

    // Try the primary model first
    try {
      return await this.callProvider(modelConfig.provider, modelConfig.model_id, request);
    } catch (error) {
      console.error(`❌ Primary model failed: ${error.message}`);
      
      // Try fallback models in order
      const fallbackProviders = ['openai', 'anthropic', 'google'];
      
      for (const provider of fallbackProviders) {
        if (provider !== modelConfig.provider) {
          try {
            const fallbackModel = this.getDefaultModelForProvider(provider);
            console.log(`🔄 Trying fallback: ${fallbackModel} from ${provider}`);
            return await this.callProvider(provider, fallbackModel, request);
          } catch (fallbackError) {
            console.error(`❌ Fallback ${provider} failed: ${fallbackError.message}`);
            continue;
          }
        }
      }
      
      // If all providers fail, throw the original error
      throw error;
    }
  }

  private async getModelConfigForFeature(feature: string) {
    // This would query the ai_feature_models table
    // For now, we'll use defaults but this is where admin model selection would be integrated
    const featureModelMap = {
      'fitness_chat': { provider: 'openai', model_id: 'gpt-4o-mini' },
      'meal_plan': { provider: 'openai', model_id: 'gpt-4o-mini' },
      'exercise_program': { provider: 'openai', model_id: 'gpt-4o-mini' },
      'chat': { provider: 'openai', model_id: 'gpt-4o-mini' }
    };
    
    return featureModelMap[feature] || null;
  }

  private getDefaultModelForProvider(provider: string): string {
    switch (provider) {
      case 'openai':
        return 'gpt-4o-mini';
      case 'anthropic':
        return 'claude-3-5-haiku-20241022';
      case 'google':
        return 'gemini-1.5-flash-002';
      default:
        return 'gpt-4o-mini';
    }
  }

  private async callProvider(provider: string, modelId: string, request: any) {
    switch (provider) {
      case 'openai':
        return await this.callOpenAI(modelId, request);
      case 'anthropic':
        return await this.callAnthropic(modelId, request);
      case 'google':
        return await this.callGoogle(modelId, request);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async callOpenAI(modelId: string, request: any) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4000
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error response:', errorBody);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: modelId,
      provider: 'openai',
      usage: data.usage
    };
  }

  private async callAnthropic(modelId: string, request: any) {
    if (!this.anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Convert OpenAI format to Anthropic format
    const messages = request.messages.filter(m => m.role !== 'system');
    const systemMessage = request.messages.find(m => m.role === 'system')?.content || '';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': this.anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        system: systemMessage,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      model: modelId,
      provider: 'anthropic',
      usage: data.usage
    };
  }

  private async callGoogle(modelId: string, request: any) {
    if (!this.googleApiKey) {
      throw new Error('Google API key not configured');
    }

    // Convert OpenAI format to Google format
    const contents = request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    const systemInstruction = request.messages.find(m => m.role === 'system')?.content;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${this.googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.maxTokens || 4000
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates[0].content.parts[0].text,
      model: modelId,
      provider: 'google',
      usage: data.usageMetadata
    };
  }
}
