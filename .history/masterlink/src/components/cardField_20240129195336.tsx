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
          <a href={card.link} target="_blank" rel="noopener noreferrer"><img alt={card.text} tite={card.text} height="40" src={card.imageUri} alt={card.text} />
          </a>
        </div>
      ))}
    </div>
  );
};

export default CardField;
