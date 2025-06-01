
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Plus, 
  Settings, 
  DollarSign, 
  Zap, 
  Eye,
  Edit,
  Bot
} from "lucide-react";
import { useAIModels, AIModel } from "@/hooks/useAIModels";

const AIModelsTab = () => {
  const { models, featureModels, isLoading, createModel, updateModel, updateFeatureModel } = useAIModels();
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

  const handleUpdateFeatureModel = (featureName: string, primaryModelId: string, fallbackModelId?: string) => {
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

  const capabilityOptions = ['text', 'vision', 'function_calling', 'streaming'];
  const featureNames = ['meal_plan', 'exercise_program', 'chat', 'food_analysis', 'meal_recipe'];

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
            <p className="text-gray-600">Configure AI models and feature assignments</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Models
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Feature Assignments
          </TabsTrigger>
        </TabsList>

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
                    <TableHead>Capabilities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-gray-500">{model.model_id}</div>
                          {model.is_default && (
                            <Badge variant="secondary" className="text-xs mt-1">Default</Badge>
                          )}
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
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.map((cap) => (
                            <Badge key={cap} variant="outline" className="text-xs">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${model.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          {model.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedModel(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Model Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureNames.map((featureName) => {
                  const assignment = featureModels.find(fm => fm.feature_name === featureName);
                  return (
                    <div key={featureName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">
                          {featureName.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Current: {assignment?.primary_model?.name || 'Not assigned'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={assignment?.primary_model_id || ''}
                          onValueChange={(value) => handleUpdateFeatureModel(featureName, value, assignment?.fallback_model_id)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select primary model" />
                          </SelectTrigger>
                          <SelectContent>
                            {models.filter(m => m.is_active).map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
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
      </Tabs>
    </div>
  );
};

export default AIModelsTab;
