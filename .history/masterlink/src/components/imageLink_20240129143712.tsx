import React from 'react';

interface ImageLinkProps {
  imageUri: string;
  text: string;
  link: string;
}

const ImageLink: React.FC<ImageLinkProps> = ({ imageUri, text, link }) => (
  <div>
    <a href={link} target="_blank" rel="noopener noreferrer">
      <img src={imageUri} alt={text} />
      <span>{text}</span>
    </a>
  </div>
);

export default ImageLink;
