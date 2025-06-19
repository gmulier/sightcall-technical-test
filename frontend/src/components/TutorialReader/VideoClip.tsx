import React from 'react';
import { Block } from 'jsxstyle';
import { tutorialStyles } from '../../styles/tutorialStyles';
import { getVideoUrl, formatVideoTiming } from '../../utils/tutorialUtils';

interface VideoClipProps {
  fileUrl: string;
  start: number;
  end: number;
}

export const VideoClip: React.FC<VideoClipProps> = ({ fileUrl, start, end }) => (
  <Block marginBottom={tutorialStyles.step.marginBottom}>
    <Block
      component="video"
      {...tutorialStyles.video}
      props={{
        controls: true,
        preload: "metadata",
        src: getVideoUrl(fileUrl, true)
      }}
    />
    <Block {...tutorialStyles.videoCaption}>
      {formatVideoTiming(start, end)}
    </Block>
  </Block>
); 