
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  cost_per_1k_tokens: number;
  max_tokens: number;
  context_window: number;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AIFeatureModel {
  id: string;
  feature_name: string;
  primary_model_id: string;
  fallback_model_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  primary_model?: AIModel;
  fallback_model?: AIModel;
}
