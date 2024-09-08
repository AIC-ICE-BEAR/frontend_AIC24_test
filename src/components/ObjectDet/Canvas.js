import React, { useState } from 'react';
import iconMap from './iconmap';


// DraggableIcon component
export const DraggableIcon = ({ icon, onDragStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-center cursor-pointer w-6 h-6" // Added relative for positioning
    >
      {iconMap[icon.label]}
      {isHovered && (
        <span className="absolute -bottom-2 -right-2 transform translate-x-1/2 translate-y-1/2 bg-black text-white text-xs px-1 py-0.5 rounded shadow-lg">
          {icon.label}
        </span>
      )}
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





const DroppableCanvas = ({ droppedItems, handleDrop, handleDelete, onKeyPressFunction }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const rows = 10;  // Number of rows in the grid
  const cols = 10;  // Number of columns in the grid

  return (
    <div className="flex flex-col items-center">
      <div
        onKeyPress={(e) => onKeyPressFunction(e, droppedItems)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        tabIndex={0} // Make the canvas focusable to capture keypress events
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
              <div className='item-center'>
                {iconMap[item.src]}
              </div>
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


