
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface AIModelConfig {
  modelId: string;
  provider: string;
}

interface AIRequest {
  messages: Array<{ role: string; content: any }>;
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
  private anthropicApiKey?: string;
  private googleApiKey?: string;

  constructor(openAIApiKey: string, anthropicApiKey?: string, googleApiKey?: string) {
    this.openAIApiKey = openAIApiKey;
    this.anthropicApiKey = anthropicApiKey;
    this.googleApiKey = googleApiKey;
  }

  /**
   * Get configured model for a feature from database
   */
  async getModelForFeature(featureName: string): Promise<AIModelConfig> {
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      console.log(`🔍 Looking up AI model for feature: ${featureName}`);

      const { data, error } = await supabase
        .from('ai_feature_models')
        .select(`
          primary_model:ai_models!primary_model_id(
            model_id,
            provider,
            is_active
          )
        `)
        .eq('feature_name', featureName)
        .eq('is_active', true)
        .single();

      if (error || !data?.primary_model) {
        console.warn(`⚠️ No AI model configured for feature: ${featureName}, using default OpenAI`);
        return {
          modelId: 'gpt-4o-mini',
          provider: 'openai'
        };
      }

      const model = data.primary_model as any;
      
      if (!model.is_active) {
        console.warn(`⚠️ Configured AI model is inactive for feature: ${featureName}, using default`);
        return {
          modelId: 'gpt-4o-mini',
          provider: 'openai'
        };
      }

      console.log(`✅ Found model for ${featureName}: ${model.provider}:${model.model_id}`);
      return {
        modelId: model.model_id,
        provider: model.provider
      };
    } catch (error) {
      console.error('❌ Error fetching AI model configuration:', error);
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
    
    try {
      switch (model.provider) {
        case 'openai':
          return await this.generateWithOpenAI(model.modelId, request);
        case 'anthropic':
          return await this.generateWithAnthropic(model.modelId, request);
        case 'google':
          return await this.generateWithGoogle(model.modelId, request);
        default:
          console.warn(`❌ Unsupported provider: ${model.provider}, falling back to OpenAI`);
          return await this.generateWithOpenAI('gpt-4o-mini', request);
      }
    } catch (error) {
      console.error(`❌ Error with ${model.provider}:${model.modelId} - ${error.message}`);
      // Fallback to OpenAI on error
      if (model.provider !== 'openai') {
        console.log('🔄 Falling back to OpenAI due to error');
        return await this.generateWithOpenAI('gpt-4o-mini', request);
      }
      throw error;
    }
  }

  /**
   * OpenAI implementation
   */
  private async generateWithOpenAI(
    modelId: string, 
    request: AIRequest
  ): Promise<AIResponse> {
    console.log(`📤 Calling OpenAI with model: ${modelId}`);
    
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
      console.error(`❌ OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ OpenAI response received successfully`);
    
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
   * Anthropic implementation
   */
  private async generateWithAnthropic(
    modelId: string, 
    request: AIRequest
  ): Promise<AIResponse> {
    if (!this.anthropicApiKey) {
      console.error('❌ Anthropic API key not provided, falling back to OpenAI');
      return this.generateWithOpenAI('gpt-4o-mini', request);
    }

    console.log(`📤 Calling Anthropic with model: ${modelId}`);

    // Convert OpenAI format messages to Anthropic format
    const systemMessage = request.messages.find(m => m.role === 'system');
    const conversationMessages = request.messages.filter(m => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: request.maxTokens || 4000,
        temperature: request.temperature || 0.7,
        system: systemMessage?.content || '',
        messages: conversationMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
        }))
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Anthropic API error: ${response.status} - ${errorText}`);
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Anthropic response received successfully`);
    
    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      }
    };
  }

  /**
   * Google Gemini implementation - FIXED
   */
  private async generateWithGoogle(
    modelId: string, 
    request: AIRequest
  ): Promise<AIResponse> {
    if (!this.googleApiKey) {
      console.error('❌ Google API key not provided, falling back to OpenAI');
      return this.generateWithOpenAI('gpt-4o-mini', request);
    }

    console.log(`📤 Calling Google Gemini with model: ${modelId}`);

    // Convert messages to Google format
    const contents = request.messages
      .filter(m => m.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }]
      }));

    const systemInstruction = request.messages.find(m => m.role === 'system')?.content;

    const requestBody: any = {
      contents,
      generationConfig: {
        temperature: request.temperature || 0.7,
        maxOutputTokens: request.maxTokens || 4000,
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    console.log(`🔍 Google API Request for ${modelId}:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${this.googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Google API error: ${response.status} - ${errorText}`);
      throw new Error(`Google API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`🔍 Google API Response:`, JSON.stringify(data, null, 2));

    if (!data.candidates || data.candidates.length === 0) {
      console.error(`❌ No response generated from Google API:`, data);
      throw new Error('No response generated from Google API');
    }

    if (data.candidates[0].finishReason === 'SAFETY') {
      console.error(`❌ Google API blocked response due to safety:`, data);
      throw new Error('Response blocked by Google safety filters');
    }
    
    console.log(`✅ Google response received successfully`);
    
    return {
      content: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      }
    };
  }
}
