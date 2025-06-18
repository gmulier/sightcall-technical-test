import React, { useMemo } from 'react';
import { Block } from 'jsxstyle';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Tutorial } from '../../types';
import { markdownStyles } from '../../styles/markdown';
import { generateMarkdown } from '../../utils/markdownGenerator';

interface TutorialViewerProps {
  tutorial: Tutorial;
}

export const TutorialViewer: React.FC<TutorialViewerProps> = ({ tutorial }) => {
  const currentMarkdown = useMemo(() => {
    return generateMarkdown(tutorial);
  }, [tutorial]);

  return (
    <Block
      fontSize="16px"
      lineHeight="1.6"
      color="#24292e"
      props={{ style: markdownStyles }}
    >
      {currentMarkdown ? (
        <ReactMarkdown key={tutorial.id} rehypePlugins={[rehypeRaw]}>
          {currentMarkdown}
        </ReactMarkdown>
      ) : (
        <Block 
          textAlign="center" 
          padding="40px" 
          color="#586069"
          fontSize="14px"
        >
          Loading tutorial content...
        </Block>
      )}
    </Block>
  );
}; 