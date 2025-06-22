import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Plus, 
  Settings, 
  DollarSign, 
  Edit,
  Bot,
  RefreshCw,
  Key,
  AlertCircle,
  Trash2,
  Star
} from "lucide-react";
import { useAIModels, AIModel } from "@/shared/hooks/useAIModels";

const AIModelsTab = () => {
  const { models, featureModels, isLoading, createModel, updateModel, deleteModel, updateFeatureModel, isUpdating } = useAIModels();
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    provider: 'openai',
    model_id: '',
    capabilities: [] as string[],
    cost_per_1k_tokens: 0,
    max_tokens: 4096,
    context_window: 4096,
    description: '',
    is_active: true,
    is_default: false,
  });

  // All AI features in the system - CLARIFIED CHAT FEATURES
  const allFeatures = [
    { id: 'meal_plan', name: 'Meal Plan Generation', description: 'AI-powered weekly meal planning' },
    { id: 'exercise_program', name: 'Exercise Program', description: 'Workout program generation' },
    { id: 'chat', name: 'General AI Chat', description: 'General purpose AI assistant (used in Chat page AI tab)' },
    { id: 'fitness_chat', name: 'Fitness Chat Coach', description: 'Specialized fitness coaching chat with user profile context' },
    { id: 'food_analysis', name: 'Food Analysis', description: 'Image-based food analysis and recognition' },
    { id: 'meal_recipe', name: 'Recipe Generation', description: 'Individual meal recipe creation' },
    { id: 'exercise_exchange', name: 'Exercise Exchange', description: 'Exercise substitution and alternatives' },
    { id: 'snack_generation', name: 'Snack Generation', description: 'AI-powered snack suggestions' },
    { id: 'meal_alternatives', name: 'Meal Alternatives', description: 'Alternative meal suggestions' },
    { id: 'meal_image', name: 'Meal Image Generation', description: 'AI-generated meal images' }
  ];

  // Popular model configurations by provider - UPDATED with current Google models
  const popularModels = {
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o', cost: 0.005, maxTokens: 4096 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', cost: 0.00015, maxTokens: 16384 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', cost: 0.01, maxTokens: 4096 },
    ],
    anthropic: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', cost: 0.003, maxTokens: 8192 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', cost: 0.00025, maxTokens: 4096 },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', cost: 0.015, maxTokens: 4096 },
    ],
    google: [
      // Current production models (as of 2024)
      { id: 'gemini-1.5-pro-002', name: 'Gemini 1.5 Pro (Latest)', cost: 0.00125, maxTokens: 8192, free: false },
      { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash (Latest)', cost: 0.000075, maxTokens: 8192, free: true },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', cost: 0.0000375, maxTokens: 8192, free: true },
      // Stable versions
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Stable)', cost: 0.00125, maxTokens: 8192, free: false },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Stable)', cost: 0.000075, maxTokens: 8192, free: true },
      // Legacy (will be deprecated)
      { id: 'gemini-pro', name: 'Gemini Pro (Legacy)', cost: 0.0005, maxTokens: 4096, free: true },
    ]
  };

  const handleCreateModel = () => {
    createModel(newModel);
    setIsCreateDialogOpen(false);
    setNewModel({
      name: '',
      provider: 'openai',
      model_id: '',
      capabilities: [],
      cost_per_1k_tokens: 0,
      max_tokens: 4096,
      context_window: 4096,
      description: '',
      is_active: true,
      is_default: false,
    });
  };

  const handleQuickAddModel = (provider: string, modelConfig: any) => {
    setNewModel({
      name: modelConfig.name,
      provider,
      model_id: modelConfig.id,
      capabilities: ['text', 'chat'],
      cost_per_1k_tokens: modelConfig.cost,
      max_tokens: modelConfig.maxTokens,
      context_window: modelConfig.maxTokens,
      description: `${modelConfig.name} from ${provider}${modelConfig.free ? ' (Free tier available)' : ''}`,
      is_active: true,
      is_default: false,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDeleteModel = (modelId: string) => {
    if (confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      deleteModel(modelId);
    }
  };

  const handleSetDefaultModel = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      // First set all other models to not default
      models.forEach(m => {
        if (m.is_default && m.id !== modelId) {
          updateModel({ id: m.id, is_default: false });
        }
      });
      
      // Then set the selected model as default
      updateModel({ id: modelId, is_default: true });
    }
  };

  const handleUpdateFeatureModel = (featureName: string, primaryModelId: string, fallbackModelId?: string) => {
    console.log('🔄 Updating feature model assignment:', { featureName, primaryModelId, fallbackModelId });
    updateFeatureModel({
      feature_name: featureName,
      primary_model_id: primaryModelId,
      fallback_model_id: fallbackModelId,
    });
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-100 text-green-800';
      case 'anthropic': return 'bg-purple-100 text-purple-800';
      case 'google': return 'bg-blue-100 text-blue-800';
      case 'local': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedModel = (featureName: string) => {
    const assignment = featureModels.find(fm => fm.feature_name === featureName);
    return assignment?.primary_model_id || '';
  };

  const getAssignedModelName = (featureName: string) => {
    const assignment = featureModels.find(fm => fm.feature_name === featureName);
    if (assignment?.primary_model) {
      return assignment.primary_model.name;
    }
    return 'Not assigned';
  };

  const defaultModel = models.find(m => m.is_default);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading AI models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Models Management</h2>
            <p className="text-gray-600">Configure AI models and feature assignments across multiple providers</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New AI Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  placeholder="e.g., GPT-4o Mini"
                />
              </div>
              
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Select value={newModel.provider} onValueChange={(value) => setNewModel({ ...newModel, provider: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model_id">Model ID</Label>
                <Input
                  id="model_id"
                  value={newModel.model_id}
                  onChange={(e) => setNewModel({ ...newModel, model_id: e.target.value })}
                  placeholder="e.g., gpt-4o-mini"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="cost">Cost per 1K tokens ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.001"
                    value={newModel.cost_per_1k_tokens}
                    onChange={(e) => setNewModel({ ...newModel, cost_per_1k_tokens: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_tokens">Max Tokens</Label>
                  <Input
                    id="max_tokens"
                    type="number"
                    value={newModel.max_tokens}
                    onChange={(e) => setNewModel({ ...newModel, max_tokens: parseInt(e.target.value) || 4096 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newModel.description}
                  onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                  placeholder="Brief description of the model"
                />
              </div>

              <Button onClick={handleCreateModel} className="w-full">
                Create Model
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Default Model Alert */}
      <Alert>
        <Star className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>Default Fallback Model:</strong> {defaultModel ? `${defaultModel.name} (${defaultModel.provider})` : 'No default model set'}
              <br />
              <span className="text-sm text-gray-600">
                This model is used as the final fallback when all configured models fail
              </span>
            </div>
            {!defaultModel && (
              <Badge variant="destructive" className="ml-2">
                No Default Set
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Enhanced API Keys Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>API Keys Required:</strong> Configure these secrets in Supabase Edge Function Secrets:
          <div className="mt-2 space-y-1 text-sm">
            <div>• <code>OPENAI_API_KEY</code> - Required for OpenAI models (GPT-4o, GPT-4o-mini)</div>
            <div>• <code>ANTHROPIC_API_KEY</code> - Required for Claude models (optional)</div>
            <div>• <code>GOOGLE_API_KEY</code> - Required for Gemini models (optional)</div>
          </div>
          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
            <strong>📱 Free Google Models Available:</strong>
            <br />• <strong>Gemini 1.5 Flash</strong> - Fast, efficient, good for chat
            <br />• <strong>Gemini 1.5 Flash 8B</strong> - Lightweight version
            <br />• <strong>Gemini Pro (Legacy)</strong> - Will be deprecated soon
          </div>
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <strong>Chat Features Clarification:</strong>
            <br />• <strong>General AI Chat</strong> = Basic AI assistant in Chat page
            <br />• <strong>Fitness Chat Coach</strong> = Advanced coach with user profile context
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Feature Assignments
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="quick-add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Quick Add
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Feature Model Assignments
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="ml-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allFeatures.map((feature) => {
                  const currentAssignment = getAssignedModel(feature.id);
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{feature.name}</h4>
                          {(feature.id === 'chat' || feature.id === 'fitness_chat') && (
                            <Badge variant="outline" className="text-xs">
                              {feature.id === 'chat' ? 'Basic' : 'Advanced'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Current: {getAssignedModelName(feature.id)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={currentAssignment}
                          onValueChange={(value) => handleUpdateFeatureModel(feature.id, value)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            {models.filter(m => m.is_active).map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${getProviderColor(model.provider)} text-xs`}>
                                    {model.provider.toUpperCase()}
                                  </Badge>
                                  {model.name}
                                  {model.is_default && (
                                    <Star className="h-3 w-3 text-yellow-500" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Available AI Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Max Tokens</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {model.is_default && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{model.model_id}</div>
                          <div className="flex gap-1 mt-1">
                            {model.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getProviderColor(model.provider)}>
                          {model.provider.charAt(0).toUpperCase() + model.provider.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{model.cost_per_1k_tokens}/1K</span>
                        </div>
                      </TableCell>
                      <TableCell>{model.max_tokens?.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${model.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {model.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {!model.is_default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefaultModel(model.id)}
                              title="Set as default model"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedModel(model)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteModel(model.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-add" className="space-y-4">
          <div className="grid gap-6">
            {Object.entries(popularModels).map(([provider, modelsList]) => (
              <Card key={provider}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={getProviderColor(provider)}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </Badge>
                    Popular Models
                    {provider === 'google' && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Free Tier Available
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {modelsList.map((model: any) => (
                      <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{model.name}</h4>
                            {model.free && (
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                FREE
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            ${model.cost}/1K tokens • {model.maxTokens.toLocaleString()} max tokens
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAddModel(provider, model)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelsTab;
