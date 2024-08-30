import React from 'react';


const DroppableCanvas = ({ droppedItems, handleDrop, handleDelete }) => {
  const rows = 10;  // Number of rows in the grid
  const cols = 10;  // Number of columns in the grid

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative w-full h-96 border border-4 border-black"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`, 
        gridTemplateRows: `repeat(${rows}, 1fr)`,   
        backgroundSize: '100% 100%',
      }}
    >
      {/* Overlay grid lines */}
      {Array.from({ length: rows * cols }, (_, i) => (
        <div key={i} className="border border-gray-400"></div>
      ))}

      {/* Render Dropped Items */}
      {droppedItems.map((item, index) => (
        <div
          key={index}
          style={{ position: 'absolute', top: item.y, left: item.x }}
          className="relative cursor-move"
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData('dropped-item', JSON.stringify({ ...item, index }));
          }}
        >
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            style={{ transform: 'translate(50%, -50%)' }}
          >
            &times;
          </button>
          <img src={item.src} alt={item.label} className="h-10 w-10" />
          <p className="text-xs text-center">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DroppableCanvas;
