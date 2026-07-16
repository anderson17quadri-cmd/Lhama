import {StyleSheet} from 'react-native';
import {EdgeInsets} from 'react-native-safe-area-context';
import {Theme} from '../../utils/types';

export const createStyles = (theme: Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flexGrow: 1,
      padding: theme.spacing.default,
      paddingBottom: theme.spacing.default + insets.bottom,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borders.default,
      overflow: 'hidden',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    section: {
      padding: theme.spacing.default * 2,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.surfaceVariant,
    },
    sectionTitle: {
      ...theme.fonts.titleMedium,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.default,
    },
    description: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.default,
      lineHeight: 22,
    },
    field: {
      marginBottom: theme.spacing.default,
    },
    label: {
      ...theme.fonts.labelMedium,
      color: theme.colors.onSurface,
      marginBottom: theme.spacing.default / 2,
    },
    actionButton: {
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      marginTop: theme.spacing.default / 2,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.default,
    },
    rowButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
    },
    loader: {
      marginTop: theme.spacing.default,
    },
    resultBox: {
      marginTop: theme.spacing.default,
      padding: theme.spacing.default,
      borderRadius: theme.borders.default,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderWidth: 1,
      borderColor: theme.colors.surfaceVariant,
      maxHeight: 320,
    },
    resultText: {
      ...theme.fonts.bodySmall,
      color: theme.colors.onSurface,
      fontFamily: 'monospace',
    },
    hint: {
      ...theme.fonts.bodySmall,
      color: theme.colors.onSurfaceVariant,
      opacity: 0.7,
      marginTop: theme.spacing.default / 2,
    },
  });
