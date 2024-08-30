import React, { useState } from 'react';


// DraggableIcon component
export const DraggableIcon = ({ icon, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon)}
      className="flex flex-col items-center justify-center cursor-pointer w-6 h-6" // Tailwind classes to center content
    >
      <img src={icon.src} alt={icon.label} className="h-6 w-6 pointer-events-none" /> {/* Prevent clicks on the image itself */}

    </div>
  );
};


export const DraggableColor = ({ icon, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon)}
      className="flex flex-col items-center justify-center cursor-pointer w-6 h-6"
      style={{ backgroundColor: icon.color }} // Apply the color directly using inline styles
    >
      {/* You can add more content here if needed */}
    </div>
  );
};




const DroppableCanvas = ({ droppedItems, handleDrop, handleDelete }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const rows = 10;  // Number of rows in the grid
  const cols = 10;  // Number of columns in the grid

  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative border-4 border-black"
        style={{
          width: `${width}px`,  // Dynamically set width
          height: `${height}px`, // Dynamically set height
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

            {/* Render based on item type */}
            {item.src ? (
              <img src={item.src} alt={item.label} className="h-10 w-10" />
            ) : item.color ? (
              <div
                className="h-10 w-10"
                style={{ backgroundColor: item.color }}
              />
            ) : null}

            <p className="text-xs text-center">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroppableCanvas;
