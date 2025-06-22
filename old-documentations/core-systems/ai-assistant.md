
# FitFatta AI Assistant Documentation

Comprehensive guide to the AI-powered fitness and nutrition assistant for React Native/Expo implementation.

## 🤖 System Architecture

### Overview
FitFatta's AI Assistant provides personalized fitness and nutrition guidance through conversational AI, leveraging multiple AI models with fallback mechanisms and cultural awareness.

### Core Components
```typescript
interface AIAssistant {
  chatEngine: ChatEngine;
  contextManager: ContextManager;
  modelFallback: ModelFallbackSystem;
  personalization: PersonalizationEngine;
  safetyFilter: SafetyFilter;
}
```

## 🗃️ Database Schema

### Chat & Conversation Tables
```sql
-- AI Chat conversations
CREATE TABLE ai_chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  context_data JSONB DEFAULT '{}', -- User profile context
  conversation_type TEXT DEFAULT 'general', -- 'fitness', 'nutrition', 'general'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual chat messages
CREATE TABLE ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_chat_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users NOT NULL,
  message_type TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Model used, processing time, etc.
  tokens_used INTEGER DEFAULT 0,
  model_used TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI model configuration
CREATE TABLE ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- 'openai', 'google', 'anthropic'
  model_id TEXT NOT NULL, -- 'gpt-4o-mini', 'gemini-pro', 'claude-3-haiku'
  name TEXT NOT NULL,
  description TEXT,
  capabilities TEXT[] DEFAULT '{}', -- ['chat', 'vision', 'function_calling']
  context_window INTEGER DEFAULT 4096,
  max_tokens INTEGER DEFAULT 4096,
  cost_per_1k_tokens NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 1, -- 1 = highest priority
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature-specific model assignments
CREATE TABLE ai_feature_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL, -- 'fitness_chat', 'nutrition_chat', 'general_chat'
  primary_model_id UUID REFERENCES ai_models(id),
  fallback_model_id UUID REFERENCES ai_models(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat preferences and settings
CREATE TABLE ai_chat_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  preferred_language TEXT DEFAULT 'en',
  conversation_style TEXT DEFAULT 'professional', -- 'casual', 'professional', 'motivational'
  include_context BOOLEAN DEFAULT true,
  auto_save_conversations BOOLEAN DEFAULT true,
  max_conversation_length INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Database Functions
```sql
-- Get conversation with messages
CREATE OR REPLACE FUNCTION get_conversation_with_messages(
  conversation_id_param UUID,
  user_id_param UUID,
  limit_param INTEGER DEFAULT 50
) RETURNS JSONB AS $$
DECLARE
  conversation_data JSONB;
  messages_data JSONB;
BEGIN
  -- Get conversation details
  SELECT to_jsonb(c.*) INTO conversation_data
  FROM ai_chat_conversations c
  WHERE c.id = conversation_id_param AND c.user_id = user_id_param;
  
  IF conversation_data IS NULL THEN
    RETURN jsonb_build_object('error', 'Conversation not found');
  END IF;
  
  -- Get recent messages
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', m.id,
      'message_type', m.message_type,
      'content', m.content,
      'metadata', m.metadata,
      'created_at', m.created_at
    ) ORDER BY m.created_at ASC
  ) INTO messages_data
  FROM (
    SELECT * FROM ai_chat_messages 
    WHERE conversation_id = conversation_id_param 
    ORDER BY created_at DESC 
    LIMIT limit_param
  ) m;
  
  RETURN jsonb_build_object(
    'conversation', conversation_data,
    'messages', COALESCE(messages_data, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new conversation
CREATE OR REPLACE FUNCTION create_ai_conversation(
  user_id_param UUID,
  title_param TEXT DEFAULT 'New Conversation',
  conversation_type_param TEXT DEFAULT 'general',
  context_data_param JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  INSERT INTO ai_chat_conversations (
    user_id, title, conversation_type, context_data
  ) VALUES (
    user_id_param, title_param, conversation_type_param, context_data_param
  ) RETURNING id INTO conversation_id;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🎯 AI Model Management

### Model Configuration
```typescript
interface AIModel {
  id: string;
  provider: 'openai' | 'google' | 'anthropic';
  modelId: string;
  name: string;
  capabilities: string[];
  contextWindow: number;
  maxTokens: number;
  costPer1kTokens: number;
  isActive: boolean;
  priority: number;
}

const aiModels: AIModel[] = [
  {
    id: 'openai-gpt4o-mini',
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    capabilities: ['chat', 'vision', 'function_calling'],
    contextWindow: 128000,
    maxTokens: 4096,
    costPer1kTokens: 0.15,
    isActive: true,
    priority: 1
  },
  {
    id: 'google-gemini-flash',
    provider: 'google',
    modelId: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash',
    capabilities: ['chat', 'vision'],
    contextWindow: 1048576,
    maxTokens: 8192,
    costPer1kTokens: 0.0375,
    isActive: true,
    priority: 2
  },
  {
    id: 'anthropic-claude-haiku',
    provider: 'anthropic',
    modelId: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    capabilities: ['chat'],
    contextWindow: 200000,
    maxTokens: 4096,
    costPer1kTokens: 0.25,
    isActive: true,
    priority: 3
  }
];
```

### Fallback System
```typescript
// src/services/AIModelService.ts
class AIModelService {
  private models: AIModel[];
  
  constructor(models: AIModel[]) {
    this.models = models.sort((a, b) => a.priority - b.priority);
  }
  
  async generateResponse(
    feature: string, 
    messages: ChatMessage[], 
    options?: GenerationOptions
  ): Promise<AIResponse> {
    const featuresModels = this.getModelsForFeature(feature);
    
    for (const model of featuresModels) {
      try {
        console.log(`🤖 Attempting generation with ${model.name}...`);
        
        const response = await this.callModel(model, messages, options);
        
        return {
          content: response.content,
          model: model.name,
          provider: model.provider,
          tokensUsed: response.tokensUsed,
          processingTime: response.processingTime
        };
        
      } catch (error) {
        console.warn(`❌ ${model.name} failed:`, error.message);
        
        // If this is the last model, throw the error
        if (model === featuresModels[featuresModels.length - 1]) {
          throw new Error(`All AI models failed. Last error: ${error.message}`);
        }
        
        // Continue to next model
        continue;
      }
    }
    
    throw new Error('No AI models available');
  }
  
  private getModelsForFeature(feature: string): AIModel[] {
    // Return active models sorted by priority
    return this.models.filter(model => model.isActive);
  }
  
  private async callModel(
    model: AIModel, 
    messages: ChatMessage[], 
    options?: GenerationOptions
  ): Promise<ModelResponse> {
    const startTime = Date.now();
    
    switch (model.provider) {
      case 'openai':
        return await this.callOpenAI(model, messages, options);
      case 'google':
        return await this.callGoogle(model, messages, options);
      case 'anthropic':
        return await this.callAnthropic(model, messages, options);
      default:
        throw new Error(`Unsupported provider: ${model.provider}`);
    }
  }
  
  private async callOpenAI(
    model: AIModel, 
    messages: ChatMessage[], 
    options?: GenerationOptions
  ): Promise<ModelResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: messages.map(msg => ({
          role: msg.message_type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || model.maxTokens,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
      processingTime: Date.now() - startTime
    };
  }
}
```

## 💬 React Native Implementation

### AI Chat Hook
```typescript
// src/hooks/useAIChat.ts
export const useAIChat = (conversationId?: string) => {
  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();
  
  // Get conversation with messages
  const { data: conversationData, isLoading } = useQuery({
    queryKey: ['ai-conversation', conversationId],
    queryFn: async () => {
      if (!conversationId || !user?.id) return null;
      
      const { data, error } = await supabase.rpc('get_conversation_with_messages', {
        conversation_id_param: conversationId,
        user_id_param: user.id,
        limit_param: 50
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!conversationId && !!user?.id
  });
  
  // Get user's conversations list
  const { data: conversations = [] } = useQuery({
    queryKey: ['ai-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
  
  // Create new conversation
  const createConversation = useMutation({
    mutationFn: async (params: {
      title?: string;
      type?: string;
      contextData?: any;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('create_ai_conversation', {
        user_id_param: user.id,
        title_param: params.title || 'New Conversation',
        conversation_type_param: params.type || 'general',
        context_data_param: params.contextData || {}
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    }
  });
  
  // Send message
  const sendMessage = useMutation({
    mutationFn: async (params: {
      conversationId: string;
      message: string;
      contextData?: any;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      setIsTyping(true);
      
      try {
        // Save user message
        const { error: userMessageError } = await supabase
          .from('ai_chat_messages')
          .insert({
            conversation_id: params.conversationId,
            user_id: user.id,
            message_type: 'user',
            content: params.message
          });
          
        if (userMessageError) throw userMessageError;
        
        // Get AI response
        const { data, error } = await supabase.functions.invoke('fitness-chat', {
          body: {
            message: params.message,
            conversationId: params.conversationId,
            userProfile: params.contextData,
            chatHistory: conversationData?.messages || []
          }
        });
        
        if (error) throw error;
        
        // Save AI response
        const { error: aiMessageError } = await supabase
          .from('ai_chat_messages')
          .insert({
            conversation_id: params.conversationId,
            user_id: user.id,
            message_type: 'assistant',
            content: data.response,
            metadata: {
              model: data.model,
              tokensUsed: data.tokensUsed,
              processingTime: data.processingTime
            },
            tokens_used: data.tokensUsed,
            model_used: data.model,
            processing_time_ms: data.processingTime
          });
          
        if (aiMessageError) throw aiMessageError;
        
        return data;
        
      } finally {
        setIsTyping(false);
      }
    },
    onSuccess: () => {
      // Refresh conversation
      queryClient.invalidateQueries({ queryKey: ['ai-conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    }
  });
  
  return {
    // Data
    conversation: conversationData?.conversation,
    messages: conversationData?.messages || [],
    conversations,
    isLoading,
    isTyping,
    
    // Actions
    createConversation: createConversation.mutateAsync,
    sendMessage: sendMessage.mutateAsync,
    
    // Loading states
    isCreatingConversation: createConversation.isPending,
    isSendingMessage: sendMessage.isPending
  };
};
```

### Chat Screen Component
```typescript
// src/screens/AIChatScreen.tsx
export const AIChatScreen = ({ route, navigation }) => {
  const { conversationId } = route.params || {};
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const {
    conversation,
    messages,
    isTyping,
    sendMessage,
    createConversation
  } = useAIChat(conversationId);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const messageText = message.trim();
    setMessage('');
    
    try {
      let currentConversationId = conversationId;
      
      // Create conversation if none exists
      if (!currentConversationId) {
        currentConversationId = await createConversation({
          title: messageText.slice(0, 50),
          type: 'fitness',
          contextData: user
        });
        
        navigation.setParams({ conversationId: currentConversationId });
      }
      
      await sendMessage({
        conversationId: currentConversationId,
        message: messageText,
        contextData: user
      });
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setMessage(messageText); // Restore message
    }
  };
  
  const renderMessage = ({ item: message }) => (
    <MessageBubble
      message={message}
      isUser={message.message_type === 'user'}
      timestamp={message.created_at}
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {conversation?.title || 'AI Fitness Assistant'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ConversationsList')}>
          <Ionicons name="chatbubbles-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>AI is typing...</Text>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask about fitness, nutrition, or wellness..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: message.trim() ? '#007AFF' : '#ccc' }
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim() || isTyping}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
```

### Message Bubble Component
```typescript
// src/components/MessageBubble.tsx
interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    message_type: 'user' | 'assistant';
    created_at: string;
    metadata?: any;
  };
  isUser: boolean;
  timestamp: string;
}

export const MessageBubble = ({ message, isUser, timestamp }: MessageBubbleProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <View style={[
      styles.messageBubble,
      isUser ? styles.userBubble : styles.aiBubble
    ]}>
      <Text style={[
        styles.messageText,
        isUser ? styles.userText : styles.aiText
      ]}>
        {message.content}
      </Text>
      
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>
          {formatTime(timestamp)}
        </Text>
        
        {!isUser && message.metadata?.model && (
          <Text style={styles.modelBadge}>
            {message.metadata.model}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 4,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    marginRight: 16,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#333',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
  modelBadge: {
    fontSize: 10,
    opacity: 0.5,
    fontStyle: 'italic',
  },
});
```

## 🎯 Personalization & Context

### Context Manager
```typescript
// src/services/ContextManager.ts
class ContextManager {
  static buildUserContext(userProfile: any, conversationType: string): string {
    const contextParts = [];
    
    // Basic profile information
    if (userProfile) {
      contextParts.push(`User Profile:
- Age: ${userProfile.age || 'Unknown'}, Gender: ${userProfile.gender || 'Unknown'}
- Height: ${userProfile.height || 'Unknown'}cm, Weight: ${userProfile.weight || 'Unknown'}kg
- Fitness Goal: ${userProfile.fitness_goal || 'General health'}
- Activity Level: ${userProfile.activity_level || 'Moderate'}
- Nationality: ${userProfile.nationality || 'International'}`);
      
      // Health considerations
      if (userProfile.health_conditions?.length) {
        contextParts.push(`Health Conditions: ${userProfile.health_conditions.join(', ')}`);
      }
      
      if (userProfile.allergies?.length) {
        contextParts.push(`Allergies: ${userProfile.allergies.join(', ')}`);
      }
      
      if (userProfile.dietary_restrictions?.length) {
        contextParts.push(`Dietary Restrictions: ${userProfile.dietary_restrictions.join(', ')}`);
      }
      
      // Life phase considerations
      if (userProfile.pregnancy_trimester) {
        contextParts.push(`Pregnancy: Trimester ${userProfile.pregnancy_trimester}`);
      }
      
      if (userProfile.breastfeeding_level) {
        contextParts.push(`Breastfeeding: ${userProfile.breastfeeding_level}`);
      }
    }
    
    // Conversation-specific context
    const conversationContext = this.getConversationContext(conversationType);
    if (conversationContext) {
      contextParts.push(conversationContext);
    }
    
    return contextParts.join('\n\n');
  }
  
  private static getConversationContext(type: string): string {
    const contexts = {
      fitness: `Focus on exercise recommendations, workout planning, and physical activity guidance. 
Consider the user's fitness level and any physical limitations.`,
      
      nutrition: `Focus on nutrition advice, meal planning, and dietary guidance. 
Consider cultural food preferences and any dietary restrictions.`,
      
      general: `Provide comprehensive fitness and nutrition guidance. 
Be encouraging and motivational while staying evidence-based.`
    };
    
    return contexts[type] || contexts.general;
  }
}
```

This comprehensive AI Assistant documentation provides everything needed to implement an intelligent, context-aware fitness assistant in React Native with proper model fallbacks, conversation management, and personalization features.
