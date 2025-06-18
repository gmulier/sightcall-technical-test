# Video Integration Implementation

## Overview

This document details the implementation of video clips integration in the AI Tutorials platform. The system allows users to upload video files alongside transcript JSON files and automatically generates timestamped video clips for tutorial steps.

## Architecture

### File Organization Structure

```
media/
├── transcript_videos/              # Source videos uploaded by users
│   ├── recording_1.mp4
│   └── recording_2.mp4
└── tutorials/                      # Organized clips by tutorial
    └── {transcript_id}/            # UUID of source transcript
        └── {tutorial_id}/          # UUID of generated tutorial
            └── clips/              # Video clips for this tutorial
                ├── step_01_57.4s-81.4s.mp4
                ├── step_02_90.6s-108.4s.mp4
                └── ...
```

### Key Benefits

1. **Separation**: Multiple tutorials from same source video remain isolated
2. **Traceability**: Clear relationship between transcript → tutorial → clips
3. **Descriptive Names**: Filenames include step number and timing information
4. **Scalability**: Structure supports unlimited tutorials and clips

## Implementation Details

### 1. Frontend Upload Component (`UploadSection.tsx`)

**Dual File Upload**:
- JSON transcript file (required)
- Video file (optional, for automatic asset extraction)
- Drag & drop support for both file types
- File type validation and preview

```typescript
const handleUpload = async () => {
  if (!jsonFile) return;
  await onUpload(jsonFile, videoFile || undefined);
};
```

### 2. Backend Video Processing (`views.py`)

**Video Clip Extraction Pipeline**:

```python
def _extract_video_clips(self, tutorial, transcript):
    # Create hierarchical directory structure
    clips_dir = os.path.join(
        settings.MEDIA_ROOT, 
        'tutorials', 
        str(transcript.id), 
        str(tutorial.id), 
        'clips'
    )
    
    for step in tutorial.steps:
        if video_clip := step.get('video_clip'):
            # Generate descriptive filename
            filename = f"step_{step['index']:02d}_{start:.1f}s-{end:.1f}s.mp4"
            
            # Extract clip with MoviePy
            clip = VideoFileClip(transcript.video_file.path).subclipped(start, end)
            clip.write_videofile(filepath, audio_codec='aac')
            
            # Store URL reference
            step['video_clip']['file_url'] = f"/media/tutorials/{transcript.id}/{tutorial.id}/clips/{filename}"
```

### 3. AI Integration Enhancement

**OpenAI Prompt Engineering**:
- Modified system prompt to include `video_clip` objects in tutorial steps
- AI determines which steps need visual demonstrations
- Generates precise start/end timestamps for video segments

**Example AI Response Structure**:
```json
{
  "steps": [
    {
      "index": 1,
      "text": "Flip your bike upside down...",
      "video_clip": {
        "start": 57.4,
        "end": 81.4
      }
    }
  ]
}
```

### 4. Frontend Rendering (`markdownGenerator.ts`)

**Video Embed Generation**:
```typescript
function generateVideoClipMarkdown(fileUrl: string, videoClip: VideoClip): string {
  const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${baseUrl}${fileUrl}`;
  
  return `<video controls preload="auto" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;">
    <source src="${fullUrl}" type="video/mp4">
    Your browser does not support the video tag.
  </video>

  *Video clip: ${videoClip.start}s - ${videoClip.end}s*`;
}
```

## Technical Choices

### 1. MoviePy vs FFmpeg

**Choice**: MoviePy with FFmpeg backend
**Reasoning**:
- Python-native integration
- Handles complex video operations
- Automatic codec management
- Easier error handling than subprocess calls to FFmpeg

### 2. File Storage Strategy

**Choice**: Hierarchical filesystem organization
**Alternatives Considered**:
- Flat file structure (rejected - causes conflicts)
- Database BLOB storage (rejected - performance issues)
- Cloud storage (future enhancement)

**Benefits**:
- Clear data relationship
- Easy cleanup and maintenance
- Supports multiple tutorials from same source
- Descriptive filenames for debugging

### 3. Audio Codec Selection

**Choice**: AAC audio codec
**Reasoning**:
- Universal browser support
- Good compression ratio
- Maintained audio quality
- Explicit codec prevents browser issues

### 4. Frontend Video Display

**Choice**: HTML5 video tags with ReactMarkdown
**Alternatives Considered**:
- Custom video player component (rejected - complexity)
- External video player library (rejected - dependencies)

**Benefits**:
- Native browser controls
- Automatic thumbnail generation
- Responsive design
- Lightweight implementation

## Performance Considerations

### Video Processing

1. **Clip Size Optimization**:
   - Only extract necessary segments
   - Use efficient video codecs
   - Preserve original quality where possible

2. **Memory Management**:
   - Close video files after processing
   - Process clips sequentially to avoid memory spikes
   - Clean up temporary resources

### Frontend Loading

1. **Progressive Loading**:
   - `preload="auto"` for thumbnail generation
   - Videos load on-demand when modal opens
   - Responsive design for various screen sizes

2. **User Experience**:
   - Loading indicators during video processing
   - Graceful fallback when videos fail to load
   - Clear error messages for debugging

## Error Handling

### Backend Resilience

```python
try:
    # Video processing
    clip = VideoFileClip(transcript.video_file.path).subclipped(start, end)
    clip.write_videofile(filepath, audio_codec='aac')
    clip.close()
    # Success: add URL to step
except:
    # Failure: keep step without video
    pass
```

### Frontend Graceful Degradation

- Steps render with or without video clips
- Broken video URLs don't break the tutorial
- Clear messaging when videos are unavailable
