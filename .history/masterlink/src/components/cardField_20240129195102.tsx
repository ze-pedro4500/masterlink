import React, { useEffect, useState } from 'react';

interface CardFieldProps {
  dataUri: string;
}

interface CardData {
  imageUri: string;
  text: string;
  link: string;
}

const CardField: React.FC<CardFieldProps> = ({ dataUri }) => {
  const [cardData, setCardData] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await fetch(dataUri);
        const data = await response.json();
        setCardData(data.data);
      } catch (error) {
        console.error(`Error fetching data from dataUri:`, error);
      }
    };

    fetchCardData();
  }, [dataUri]);

  return (
    <div>
      {cardData.map((card, index) => (
        <div key={index}>
          <img height={40px} src={card.imageUri} alt={card.text} />
          <a href={card.link} target="_blank" rel="noopener noreferrer">{card.text}</a>
        </div>
      ))}
    </div>
  );
};

export default CardField;
