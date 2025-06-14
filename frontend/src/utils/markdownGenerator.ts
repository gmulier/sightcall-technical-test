import { Tutorial } from '../types';

export const generateMarkdown = (tutorial: Tutorial): string => {
  const sections = [
    `# ${tutorial.title}`,
    '',
    tutorial.introduction,
    '',
    '## Étapes',
    '',
    ...tutorial.steps.map((step, index) => `${index + 1}. ${step}`),
    ''
  ];

  if (tutorial.examples.length > 0) {
    sections.push(
      '## Exemples',
      '',
      ...tutorial.examples.map(example => `- ${example}`),
      ''
    );
  }

  sections.push(
    '## Résumé',
    '',
    tutorial.summary
  );

  return sections.join('\n');
}; 