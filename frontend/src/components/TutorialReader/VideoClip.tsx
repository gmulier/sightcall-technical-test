import React from 'react';
import { Block } from 'jsxstyle';
import { tutorialStyles } from '../../styles/tutorialStyles';
import { getVideoUrl, formatVideoTiming } from '../../utils/tutorialUtils';

interface VideoClipProps {
  fileUrl: string;
  start: number;
  end: number;
}

export const VideoClip: React.FC<VideoClipProps> = ({ fileUrl, start, end }) => {
  const videoSrc = getVideoUrl(fileUrl, true);
  
  return (
    <Block marginBottom={tutorialStyles.step.marginBottom}>
      <Block
        component="video"
        {...tutorialStyles.video}
        props={{
          controls: true,
          preload: "metadata",
          src: `${videoSrc}#t=0.1`,
          onLoadedMetadata: (e: any) => {
            // Force the browser to show the first frame as poster
            e.target.currentTime = 0.1;
          }
        }}
      />
      <Block {...tutorialStyles.videoCaption}>
        {formatVideoTiming(start, end)}
      </Block>
    </Block>
  );
}; 