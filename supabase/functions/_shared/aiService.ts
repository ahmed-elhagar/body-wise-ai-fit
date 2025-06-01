
interface AIModelConfig {
  modelId: string;
  provider: string;
}

interface AIRequest {
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  private openAIApiKey: string;

  constructor(openAIApiKey: string) {
    this.openAIApiKey = openAIApiKey;
  }

  /**
   * Get configured model for a feature from database
   */
  async getModelForFeature(featureName: string): Promise<AIModelConfig> {
    try {
      // This would be replaced with actual Supabase client call in edge function
      // For now, returning default OpenAI model to maintain compatibility
      return {
        modelId: 'gpt-4o-mini',
        provider: 'openai'
      };
    } catch (error) {
      console.warn(`Failed to get model for ${featureName}, using default:`, error);
      return {
        modelId: 'gpt-4o-mini',
        provider: 'openai'
      };
    }
  }

  /**
   * Generate AI response using configured model
   */
  async generate(
    featureName: string, 
    request: AIRequest
  ): Promise<AIResponse> {
    const model = await this.getModelForFeature(featureName);
    
    console.log(`🤖 Using ${model.provider}:${model.modelId} for feature: ${featureName}`);
    
    switch (model.provider) {
      case 'openai':
        return this.generateWithOpenAI(model.modelId, request);
      case 'anthropic':
        return this.generateWithAnthropic(model.modelId, request);
      case 'google':
        return this.generateWithGoogle(model.modelId, request);
      default:
        console.warn(`Unsupported provider: ${model.provider}, falling back to OpenAI`);
        return this.generateWithOpenAI('gpt-4o-mini', request);
    }
  }

  /**
   * OpenAI implementation
   */
  private async generateWithOpenAI(
    modelId: string, 
    request: AIRequest
  ): Promise<AIResponse> {
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
        max_tokens: request.maxTokens || 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      }
    };
  }

  /**
   * Anthropic implementation (placeholder for Phase 3)
   */
  private async generateWithAnthropic(
    modelId: string, 
    request: AIRequest
  ): Promise<AIResponse> {
    // Placeholder - will be implemented in Phase 3
    console.log('Anthropic support coming in Phase 3, falling back to OpenAI');
    return this.generateWithOpenAI('gpt-4o-mini', request);
  }

  /**
   * Google implementation (placeholder for Phase 3)
   */
  private async generateWithGoogle(
    modelId: string, 
    request: AIRequest
  ): Promise<AIResponse> {
    // Placeholder - will be implemented in Phase 3
    console.log('Google support coming in Phase 3, falling back to OpenAI');
    return this.generateWithOpenAI('gpt-4o-mini', request);
  }
}
