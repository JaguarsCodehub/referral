import React from 'react';

const cards = [
  { id: 1, points: 1000, status: 'Claim', title: 'MARK GLOB' },
  { id: 2, points: 2000, status: 'Soon', title: 'COMING SOON' },
  { id: 3, points: 2000, status: 'Soon', title: 'COMING SOON' },
  { id: 4, points: 1000, status: 'Soon', title: 'COMING SOON' },
  { id: 5, points: 4000, status: 'Soon', title: 'COMING SOON' },
  { id: 6, points: 2000, status: 'Soon', title: 'COMING SOON' },
  { id: 7, points: 4000, status: 'Soon', title: 'COMING SOON' },
  { id: 8, points: 2000, status: 'Soon', title: 'COMING SOON' },
];

const DashboardCards = () => {
  return (
    <div className=' bg-black text-white flex flex-col justify-center items-center p-4'>
      {/* <div className="text-center mb-8">
                <div className="text-4xl mb-2">0</div>
                <div className="text-lg">$GLOB ACQUIRED</div>
            </div> */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:-ml-56'>
        {cards.map((card) => (
          <div
            key={card.id}
            className='p-4 w-44 h-40 bg-black/40 border border-white rounded-lg shadow-lg flex flex-col items-center'
          >
            <div className='text-lg mb-2'>{card.points}</div>
            <div
              className={`px-2 py-1 rounded-full ${
                card.status === 'Claim' ? 'bg-purple-500' : 'bg-gray-600'
              } mb-2`}
            >
              {card.status}
            </div>
            <div className='text-center'>{card.title}</div>
          </div>
        ))}
        {/* <div className="p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center col-span-1 sm:col-span-2 lg:col-span-1">
                    <div className="text-lg mb-2">?</div>
                    <div className="text-center mb-2">DAILY QUEST: #001</div>
                    <div className="text-center mb-2">"SPIN ME"</div>
                    <div className="text-center mb-2">OPERATION SPIN GLOB</div>
                    <div className="text-center mb-2">STATUS: AVAILABLE</div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-full">SPIN</button>
                </div> */}
      </div>
    </div>
  );
};

export default DashboardCards;
