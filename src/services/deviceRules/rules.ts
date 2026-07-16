import {Platform} from 'react-native';

import {parseDeviceRules} from './parse';
import {getRulesUrl} from './rulesUrls';
import {DeviceRules, Tier} from './types';

// Online fetch of `rules.<platform>.json`. Returns null (→ bundled floor) on
// any failure: network error, non-2xx, parse throw, platform mismatch, or a
// parse that yields zero models across all tiers (an incompatible hosted JSON).
// Never throws.
//
// Disabled: the hosted rules file lives in a-ghorbani/pocketpal-device-rules,
// which we don't control and which doesn't include our bundled model
// (Dolphin). Always falling back to the bundled rules.<platform>.json keeps
// our model list authoritative regardless of network state.

const FETCH_TIMEOUT_MS = 10_000;
const TIERS: Tier[] = ['low', 'mid', 'high', 'flagship'];

const hasAnyModels = (rules: DeviceRules): boolean =>
  TIERS.some(tier => rules.tiers[tier].models.length > 0);

export async function fetchRules(
  _platform: 'ios' | 'android' = Platform.OS as 'ios' | 'android',
): Promise<DeviceRules | null> {
  return null;
}

// Retained for potential future re-enablement; unused while fetchRules is
// disabled above.
async function fetchRulesFromNetwork(
  platform: 'ios' | 'android' = Platform.OS as 'ios' | 'android',
): Promise<DeviceRules | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(getRulesUrl(platform), {
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    const json = await response.json();
    const rules = parseDeviceRules(json);
    if (rules.platform !== platform) {
      return null;
    }
    if (!hasAnyModels(rules)) {
      return null;
    }
    return rules;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

void fetchRulesFromNetwork;
