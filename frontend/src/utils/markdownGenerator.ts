import { Tutorial } from '../types';

/**
 * Generate Markdown content from a tutorial object with video clips
 * 
 * This function converts the structured tutorial data into Markdown format,
 * injecting video clips at the appropriate positions between tutorial steps.
 * 
 * @param tutorial - Tutorial object with steps containing optional video clips
 * @returns Generated Markdown string
 */
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

  // Add introduction
  sections.push(
    tutorial.introduction,
    '',
    '## Steps',
    ''
  );

  // Process each step with its optional video clip
  tutorial.steps.forEach(step => {
    // Add the step text with numbering
    sections.push(`${step.index}. ${step.text}`, '');
    
    // Add video clip if available
    if (step.video_clip?.file_url) {
      const videoMarkdown = generateVideoClipMarkdown(step.video_clip.file_url, step.video_clip);
      sections.push(videoMarkdown, '');
    }
  });

      // Add tips section if available
  if (tutorial.tips.length > 0) {
    sections.push(
      '## Tips',
      '',
      ...tutorial.tips.map(tip => `- ${tip}`),
      ''
    );
  }

  // Add summary section
  sections.push(
    '## Summary',
    '',
    tutorial.summary
  );

  return sections.join('\n');
};

/**
 * Generate Markdown for a video clip
 * 
 * Converts a video clip into HTML video tag with proper controls and styling.
 * 
 * @param fileUrl - URL to the video clip file
 * @param videoClip - Video clip data with timing information
 * @returns HTML video tag as Markdown string
 */
function generateVideoClipMarkdown(fileUrl: string, videoClip: { start: number; end: number }): string {
  const baseUrl = 'http://localhost:8000';
  const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
  
  return `<video controls preload="auto" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;">
  <source src="${fullUrl}" type="video/mp4">
  Your browser does not support the video tag.
</video>

*Video clip: ${videoClip.start}s - ${videoClip.end}s*`;
} 