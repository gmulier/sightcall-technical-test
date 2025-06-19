"""
HTML generation service for creating standalone tutorial HTML files.
"""
from typing import List, Dict, Any
from ..models import Tutorial


class HtmlService:
    """Service for generating standalone HTML files from tutorials."""
    
    @staticmethod
    def generate_html(tutorial: Tutorial) -> str:
        """
        Generate a standalone HTML file with embedded CSS and video support.
        
        Args:
            tutorial: Tutorial instance to convert to HTML
            
        Returns:
            Complete HTML string with CSS styles and video elements
        """
        # Get CSS from centralized styles
        css_styles = HtmlService._get_css_styles()
        
        # Build HTML structure
        html_parts = [
            HtmlService._get_html_header(tutorial.title, css_styles),
            HtmlService._get_html_body(tutorial),
            '</html>',
        ]
        
        return '\n'.join(html_parts)
    
    @staticmethod
    def _get_css_styles() -> str:
        """Generate CSS styles for the HTML export."""
        return """
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                line-height: 1.6;
                color: #24292e;
                max-width: 900px;
                margin: 0 auto;
                padding: 40px 20px;
                background-color: #ffffff;
            }
            
            h1 {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 16px;
                color: #1f2328;
                line-height: 1.2;
            }
            
            h2 {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #1f2328;
                border-bottom: 1px solid #d1d9e0;
                padding-bottom: 8px;
            }
            
            .meta-info {
                margin-bottom: 16px;
            }
            
            .meta-info strong {
                font-weight: 600;
            }
            
            .meta-text {
                color: #656d76;
            }
            
            .introduction {
                margin-bottom: 32px;
                color: #1f2328;
                line-height: 1.7;
            }
            
            .step {
                margin-bottom: 24px;
            }
            
            .step-number {
                color: #0969da;
                font-weight: bold;
                margin-right: 8px;
            }
            
            .step-text {
                margin-bottom: 12px;
                font-size: 16px;
                line-height: 1.6;
            }
            
            .video-container {
                margin-bottom: 12px;
            }
            
            video {
                width: 100%;
                max-width: 600px;
                height: auto;
                border-radius: 8px;
                border: 1px solid #d1d9e0;
                background-color: #000;
            }
            
            .video-caption {
                font-size: 14px;
                color: #656d76;
                font-style: italic;
                margin-top: 8px;
            }
            
            ul {
                margin-bottom: 32px;
                padding-left: 20px;
            }
            
            li {
                margin-bottom: 8px;
                line-height: 1.6;
            }
            
            .summary {
                color: #1f2328;
                line-height: 1.7;
            }
        </style>
        """
    
    @staticmethod
    def _get_html_header(title: str, css_styles: str) -> str:
        """Generate HTML header with title and styles."""
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{HtmlService._escape_html(title)}</title>
    {css_styles}
</head>
<body>"""
    
    @staticmethod
    def _get_html_body(tutorial: Tutorial) -> str:
        """Generate HTML body content."""
        sections = [
            HtmlService._render_title(tutorial.title),
            HtmlService._render_meta_info(tutorial),
            HtmlService._render_introduction(tutorial.introduction),
            HtmlService._render_steps(tutorial.steps),
            HtmlService._render_tips(tutorial.tips),
            HtmlService._render_summary(tutorial.summary),
            '</body>',
        ]
        
        return '\n'.join(filter(None, sections))
    
    @staticmethod
    def _render_title(title: str) -> str:
        """Render the main title."""
        return f'    <h1>{HtmlService._escape_html(title)}</h1>'
    
    @staticmethod
    def _render_meta_info(tutorial: Tutorial) -> str:
        """Render meta information (tags, read time)."""
        meta_parts = []
        
        # Tags
        if tutorial.tags:
            tag_string = ', '.join(tutorial.tags)
            meta_parts.extend([
                '    <div class="meta-info">',
                '        <strong>Tags: </strong>',
                f'        <span class="meta-text">{HtmlService._escape_html(tag_string)}</span>',
                '    </div>',
            ])
        
        # Read time
        if tutorial.duration_estimate:
            meta_parts.extend([
                '    <div class="meta-info">',
                '        <strong>Read time: </strong>',
                f'        <span class="meta-text">{HtmlService._escape_html(tutorial.duration_estimate)}</span>',
                '    </div>',
            ])
        
        return '\n'.join(meta_parts)
    
    @staticmethod
    def _render_introduction(introduction: str) -> str:
        """Render the introduction section."""
        return f'    <div class="introduction">{HtmlService._escape_html(introduction)}</div>\n    <h2>Steps</h2>'
    
    @staticmethod
    def _render_steps(steps: List) -> str:
        """Render all tutorial steps."""
        step_parts = []
        
        for i, step in enumerate(steps, 1):
            step_data = HtmlService._normalize_step(step, i)
            step_parts.append(HtmlService._render_single_step(step_data))
        
        return '\n'.join(step_parts)
    
    @staticmethod
    def _render_single_step(step_data: Dict) -> str:
        """Render a single step with optional video."""
        step_html = [
            '    <div class="step">',
            '        <div class="step-text">',
            f'            <span class="step-number">{step_data["index"]}.</span>',
            f'            {HtmlService._escape_html(step_data["text"])}',
            '        </div>',
        ]
        
        # Add video if available
        if step_data.get('video_clip') and step_data['video_clip'].get('file_url'):
            video_html = HtmlService._render_video_clip(step_data['video_clip'])
            step_html.append(video_html)
        
        step_html.append('    </div>')
        return '\n'.join(step_html)
    
    @staticmethod
    def _render_video_clip(video_clip: Dict) -> str:
        """Render a video clip element."""
        file_url = video_clip['file_url']
        filename = file_url.split('/')[-1] if '/' in file_url else file_url
        local_path = f'clips/{filename}'
        
        return f"""        <div class="video-container">
            <video controls preload="metadata" src="{local_path}">
                Your browser does not support the video tag.
            </video>
            <div class="video-caption">
                Video clip: {video_clip.get("start", 0)}s - {video_clip.get("end", 0)}s
            </div>
        </div>"""
    
    @staticmethod
    def _render_tips(tips: List[str]) -> str:
        """Render the tips section."""
        if not tips:
            return ""
        
        tip_parts = [
            '    <h2>Tips</h2>',
            '    <ul>',
        ]
        
        for tip in tips:
            tip_parts.append(f'        <li>{HtmlService._escape_html(tip)}</li>')
        
        tip_parts.append('    </ul>')
        return '\n'.join(tip_parts)
    
    @staticmethod
    def _render_summary(summary: str) -> str:
        """Render the summary section."""
        return f'    <h2>Summary</h2>\n    <div class="summary">{HtmlService._escape_html(summary)}</div>'
    
    @staticmethod
    def _normalize_step(step: any, fallback_index: int) -> Dict:
        """Normalize step data to consistent format."""
        if isinstance(step, dict):
            return {
                'index': step.get('index', fallback_index),
                'text': step.get('text', str(step)),
                'video_clip': step.get('video_clip'),
            }
        else:
            return {
                'index': fallback_index,
                'text': str(step),
                'video_clip': None,
            }
    
    @staticmethod
    def _escape_html(text: str) -> str:
        """Escape HTML special characters in text content."""
        if not text:
            return ""
        
        return (text
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;')
                .replace("'", '&#x27;')) 