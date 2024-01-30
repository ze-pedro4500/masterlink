import React, { useEffect, useState } from 'react';
import { CardData } from '../data/cardData';
import { CardFieldProps } from '../data/cardFieldProps';

const CardField: React.FC<CardFieldProps> = ({ dataUri }) => {
  const [cardData, setCardData] = useState<CardData[]>([]);

  // populate the CardData array with the data fetched from dataUri
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
          <a className='mb-5' href={card.link} target="_blank" rel="noopener noreferrer"><img className='max-h-14' title={card.text} height="40" src={card.imageUri} alt={card.text} />
          </a>
        </div>
      ))}
    </div>
  );
};

export default CardField;