import { Tutorial } from '../types';

export const generateMarkdown = (tutorial: Tutorial): string => {
  const sections = [
    `# ${tutorial.title}`,
    ''
  ];

  // Add tags if they exist - display as comma-separated list
  if (tutorial.tags && tutorial.tags.length > 0) {
    const tagString = tutorial.tags.join(', ');
    sections.push(`**Tags:** ${tagString}`, '');
  }

  // Add read time from duration_estimate
  if (tutorial.duration_estimate) {
    sections.push(`**Read time:** ${tutorial.duration_estimate}`, '');
  }

  // Add introduction and rest of content
  sections.push(
    tutorial.introduction,
    '',
    '## Steps',
    '',
    ...tutorial.steps.map((step, index) => `${index + 1}. ${step}`),
    ''
  );

  if (tutorial.examples.length > 0) {
    sections.push(
      '## Examples',
      '',
      ...tutorial.examples.map(example => `- ${example}`),
      ''
    );
  }

  sections.push(
    '## Summary',
    '',
    tutorial.summary
  );

  return sections.join('\n');
}; 