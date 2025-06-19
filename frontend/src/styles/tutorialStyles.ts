/**
 * Centralized tutorial styles for both React components and HTML export
 */

// Colors palette
export const colors = {
  primary: '#1f2328',
  secondary: '#24292e', 
  accent: '#0969da',
  muted: '#656d76',
  border: '#d1d9e0',
  background: '#ffffff',
} as const;

// Typography scale
export const typography = {
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: '1.2',
    color: colors.primary,
  },
  h2: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '1.3',
    color: colors.primary,
  },
  body: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: colors.secondary,
  },
  caption: {
    fontSize: '14px',
    lineHeight: '1.4',
    color: colors.muted,
  },
} as const;

// Spacing scale
export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  xxl: '32px',
} as const;

// Component-specific styles
export const tutorialStyles = {
  container: {
    maxWidth: '100%',
    ...typography.body,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xl,
  },
  section: {
    ...typography.h2,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: spacing.xs,
  },
  metaInfo: {
    marginBottom: spacing.md,
  },
  metaLabel: {
    fontWeight: 600,
  },
  metaText: {
    color: colors.muted,
  },
  introduction: {
    marginBottom: spacing.xxl,
    color: colors.primary,
    lineHeight: '1.7',
  },
  step: {
    marginBottom: spacing.xl,
  },
  stepNumber: {
    color: colors.accent,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  stepText: {
    marginBottom: spacing.sm,
    ...typography.body,
  },
  video: {
    width: '100%',
    maxWidth: '600px',
    height: 'auto',
    borderRadius: spacing.xs,
    border: `1px solid ${colors.border}`,
    backgroundColor: '#000',
  },
  videoCaption: {
    ...typography.caption,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  list: {
    marginBottom: spacing.xxl,
    paddingLeft: spacing.lg,
  },
  listItem: {
    marginBottom: spacing.xs,
    lineHeight: '1.6',
  },
} as const;

// CSS string generation for HTML export
export const generateCSS = (): string => {
  return `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: ${colors.secondary};
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: ${colors.background};
    }
    
    h1 {
      font-size: ${typography.h1.fontSize};
      font-weight: ${typography.h1.fontWeight};
      margin-top: ${spacing.sm};
      margin-bottom: ${spacing.xl};
      color: ${typography.h1.color};
      line-height: ${typography.h1.lineHeight};
    }
    
    h2 {
      font-size: ${typography.h2.fontSize};
      font-weight: ${typography.h2.fontWeight};
      margin-bottom: ${spacing.lg};
      color: ${typography.h2.color};
      border-bottom: 1px solid ${colors.border};
      padding-bottom: ${spacing.xs};
    }
    
    .meta-info {
      margin-bottom: ${spacing.md};
    }
    
    .meta-info strong {
      font-weight: 600;
    }
    
    .meta-text {
      color: ${colors.muted};
    }
    
    .introduction {
      margin-bottom: ${spacing.xxl};
      color: ${colors.primary};
      line-height: 1.7;
    }
    
    .step {
      margin-bottom: ${spacing.xl};
    }
    
    .step-number {
      color: ${colors.accent};
      font-weight: bold;
      margin-right: ${spacing.xs};
    }
    
    .step-text {
      margin-bottom: ${spacing.sm};
      font-size: ${typography.body.fontSize};
      line-height: ${typography.body.lineHeight};
    }
    
    .video-container {
      margin-bottom: ${spacing.sm};
    }
    
    video {
      width: 100%;
      max-width: 600px;
      height: auto;
      border-radius: ${spacing.xs};
      border: 1px solid ${colors.border};
      background-color: #000;
    }
    
    .video-caption {
      font-size: ${typography.caption.fontSize};
      color: ${colors.muted};
      font-style: italic;
      margin-top: ${spacing.xs};
    }
    
    ul {
      margin-bottom: ${spacing.xxl};
      padding-left: ${spacing.lg};
    }
    
    li {
      margin-bottom: ${spacing.xs};
      line-height: 1.6;
    }
    
    .summary {
      color: ${colors.primary};
      line-height: 1.7;
    }
  `;
}; 