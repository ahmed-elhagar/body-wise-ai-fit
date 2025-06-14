
import { mainTranslations } from './admin/main';
import { tabs } from './admin/tabs';
import { stats } from './admin/stats';
import { users } from './admin/users';
import { subscriptions } from './admin/subscriptions';
import { aiModels } from './admin/aiModels';
import { analytics } from './admin/analytics';
import { system } from './admin/system';
import { logs } from './admin/logs';
import { dialogs } from './admin/dialogs';
import { messages } from './admin/messages';
import { actions } from './admin/actions';
import { status } from './admin/status';

export const admin = {
  ...mainTranslations,
  tabs,
  stats,
  users,
  subscriptions,
  aiModels,
  analytics,
  system,
  logs,
  dialogs,
  messages,
  actions,
  status,
} as const;
