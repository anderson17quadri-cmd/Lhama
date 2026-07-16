import React, {useContext, useState} from 'react';
import {View, ScrollView, Alert} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import {Text, Button, ActivityIndicator} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {TextInput} from '../../components';
import {useTheme} from '../../hooks';
import {createStyles} from './styles';
import {L10nContext} from '../../utils';
import {jarvisStore} from '../../store';
import {
  fetchJarvisInfo,
  fetchJarvisExecLog,
} from '../../services/jarvis/jarvisClient';

export const JarvisScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, insets);
  const l10n = useContext(L10nContext);

  const [serverUrl, setServerUrl] = useState(jarvisStore.serverUrl);
  const [token, setToken] = useState(jarvisStore.token);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');

  const saveConfig = () => {
    jarvisStore.setServerUrl(serverUrl.trim());
    jarvisStore.setToken(token.trim());
    Alert.alert(l10n.jarvis.savedTitle, l10n.jarvis.savedDescription);
  };

  const runFetch = async (fn: () => Promise<unknown>) => {
    if (!jarvisStore.serverUrl) {
      Alert.alert(l10n.common.error, l10n.jarvis.notConfigured);
      return;
    }
    setLoading(true);
    setResultText('');
    try {
      const data = await fn();
      setResultText(JSON.stringify(data, null, 2));
    } catch (e) {
      Alert.alert(
        l10n.common.error,
        e instanceof Error ? e.message : l10n.common.networkError,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchInfo = () =>
    runFetch(() => fetchJarvisInfo(jarvisStore.serverUrl, jarvisStore.token));

  const handleFetchExecLog = () =>
    runFetch(() =>
      fetchJarvisExecLog(jarvisStore.serverUrl, jarvisStore.token, 30),
    );

  const copyResult = () => {
    if (!resultText) {
      return;
    }
    Clipboard.setString(resultText);
    Alert.alert(l10n.jarvis.copiedTitle, l10n.jarvis.copiedDescription);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l10n.jarvis.configTitle}</Text>
            <Text variant="bodyMedium" style={styles.description}>
              {l10n.jarvis.configDescription}
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>{l10n.jarvis.serverUrlLabel}</Text>
              <TextInput
                defaultValue={serverUrl}
                onChangeText={setServerUrl}
                placeholder={l10n.jarvis.serverUrlPlaceholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{l10n.jarvis.tokenLabel}</Text>
              <TextInput
                defaultValue={token}
                onChangeText={setToken}
                placeholder={l10n.jarvis.tokenPlaceholder}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>

            <Button
              mode="contained"
              onPress={saveConfig}
              style={styles.actionButton}>
              {l10n.common.save}
            </Button>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{l10n.jarvis.dataTitle}</Text>
            <Text variant="bodyMedium" style={styles.description}>
              {l10n.jarvis.dataDescription}
            </Text>

            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={handleFetchInfo}
                disabled={loading}
                style={styles.rowButton}>
                {l10n.jarvis.fetchInfoButton}
              </Button>
              <Button
                mode="outlined"
                onPress={handleFetchExecLog}
                disabled={loading}
                style={styles.rowButton}>
                {l10n.jarvis.fetchLogButton}
              </Button>
            </View>

            {loading && <ActivityIndicator style={styles.loader} />}

            {!!resultText && (
              <>
                <View style={styles.resultBox}>
                  <Text selectable style={styles.resultText}>
                    {resultText}
                  </Text>
                </View>
                <Button
                  mode="text"
                  onPress={copyResult}
                  style={styles.actionButton}>
                  {l10n.jarvis.copyButton}
                </Button>
                <Text style={styles.hint}>{l10n.jarvis.pasteHint}</Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
