import React, { useState } from 'react';
import iconMap from './iconmap';

export const DraggableIcon = ({ icon, onDragStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable="true" // Enable dragging for Tailwind
      onDragStart={(e) => onDragStart(e, icon)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-center cursor-pointer w-6 h-6"
    >
      {iconMap[icon.label]}
      {isHovered && (
        <span className="absolute z-10 -bottom-2 -right-2 transform translate-x-1/2 translate-y-1/2 bg-black text-white text-xs px-1 py-0.5 rounded shadow-lg">
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
      onDragStart={(e) => onDragStart(e, icon)} // Make sure icon data is set for color
      className="flex flex-col items-center justify-center cursor-pointer w-6 h-6"
      style={{ backgroundColor: icon.color }}
    />
  );
};


const DroppableCanvas = ({ droppedItems, setDroppedItems, handleDelete }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [resizing, setResizing] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null); // Track the item being dragged
  const rows = 10;
  const cols = 10;

  // Minimum size for items
  const MIN_SIZE = 30;

  // Initialize objectDetection field if it does not exist
  const initializeObjectDetection = (item) => ({
    topLeft: { x: item.x, y: item.y },
    bottomRight: { x: item.x + (item.width || 0), y: item.y + (item.height || 0) },
    canvasSize: { width, height },
  });

  const handleMouseDown = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only handle resizing if clicked on the resize handle
    if (e.target.classList.contains('resize-handle')) {
      setResizing({
        index,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: droppedItems[index].width || 50, // Fallback to 50 if width is undefined
        startHeight: droppedItems[index].height || 50, // Fallback to 50 if height is undefined
      });
    }
  };


  const handleDrop = (e) => {
    // Prevent default browser behavior
    e.preventDefault();

    // Get the data from the event (either icon, color, or dropped item data)
    const iconData = e.dataTransfer.getData('icon');
    const colorData = e.dataTransfer.getData('color'); // Add color data handling
    const droppedItemData = e.dataTransfer.getData('dropped-item');

    // Get the position of the drop relative to the canvas
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - canvasRect.left;
    const dropY = e.clientY - canvasRect.top;

    if (iconData) {
      // If a new icon is being dropped
      const icon = JSON.parse(iconData);
      const newItem = {
        ...icon,
        x: dropX,
        y: dropY,
        width: icon.width || 50, // Default width if not provided
        height: icon.height || 50, // Default height if not provided
      };

      // Initialize object detection for the new item
      newItem.objectDetection = initializeObjectDetection(newItem);

      // Add the new item to dropped items
      setDroppedItems([...droppedItems, newItem]);
    } else if (colorData) {
      // If a new color is being dropped
      const color = JSON.parse(colorData);
      const newItem = {
        ...color,
        x: dropX,
        y: dropY,
        width: color.width || 50, // Default width for color
        height: color.height || 50, // Default height for color
        color: color.color, // Ensure color is passed correctly
      };

      // Initialize object detection for the new color item
      newItem.objectDetection = initializeObjectDetection(newItem);

      // Add the new color item to dropped items
      setDroppedItems([...droppedItems, newItem]);
    } else if (droppedItemData) {
      // If an existing item is being repositioned
      const item = JSON.parse(droppedItemData);
      const updatedItems = [...droppedItems];

      // Update the x and y position of the existing item
      updatedItems[item.index] = {
        ...updatedItems[item.index],
        x: dropX,
        y: dropY,
      };

      // Update object detection for the repositioned item
      updatedItems[item.index].objectDetection = initializeObjectDetection(updatedItems[item.index]);

      // Update the dropped items state
      setDroppedItems(updatedItems);
    }
  };




  const handleMouseMove = (e) => {
    if (resizing) {
      const { index, startX, startY, startWidth, startHeight } = resizing;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(MIN_SIZE, startWidth + deltaX);
      const newHeight = Math.max(MIN_SIZE, startHeight + deltaY);

      const updatedItems = [...droppedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        width: newWidth,
        height: newHeight,
      };

      // Ensure the new width and height are valid numbers before updating objectDetection
      if (!isNaN(newWidth) && !isNaN(newHeight)) {
        updatedItems[index].objectDetection = initializeObjectDetection(updatedItems[index]);
      }

      setDroppedItems(updatedItems);
    } else if (draggingItem) {
      const { index, offsetX, offsetY } = draggingItem;
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      const updatedItems = [...droppedItems];
      updatedItems[index] = {
        ...updatedItems[index],
        x: newX,
        y: newY,
      };

      // Update objectDetection after the item is moved
      updatedItems[index].objectDetection = initializeObjectDetection(updatedItems[index]);

      setDroppedItems(updatedItems);
    }
  };



  const handleMouseUp = () => {
    setResizing(null);
    setDraggingItem(null); // End dragging
  };


  const handleMouseDownForDragging = (index, e) => {
    e.preventDefault();
    setDraggingItem({
      index,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - droppedItems[index].x, // Offset to keep the mouse position consistent
      offsetY: e.clientY - droppedItems[index].y,
    });
  };

  return (
    <div
      className="flex flex-col items-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        // onKeyPress={(e) => onKeyPressFunction(e, droppedItems, numImages, setOBDetResult, setSearchMode)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        tabIndex={0}
        className="relative border-4 border-black"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          backgroundSize: '100% 100%',
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <div key={i} className="border border-gray-400"></div>
        ))}

        {droppedItems.map((item, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              width: item.width || 50,
              height: item.height || 50,
            }}
            className="relative cursor-move"
            draggable
            onMouseDown={(e) => handleMouseDownForDragging(index, e)}

          >
            {/* Resize Handle */}
            <div
              className="absolute resize-handle bottom-[-5px] right-[-5px] w-4 h-4 bg-gray-500"
              style={{ cursor: 'se-resize' }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            ></div>

            <button
              onClick={() => handleDelete(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              &times;
            </button>

            {item.src ? (
              <div className="h-full w-full border-2 border-black flex items-center justify-center">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: `${Math.min(item.width, item.height) * 0.7}px`,
                  }}
                >
                  {iconMap[item.src]}
                </div>
              </div>
            ) : item.color ? (
              <div
                className="h-full w-full"
                style={{ backgroundColor: item.color }}
              />
            ) : null}

            <p className="text-xs text-center">{item.label}</p>

            {/* <p className="text-xs">
              TL: ({item.objectDetection?.topLeft.x}, {item.objectDetection?.topLeft.y}) <br />
              BR: ({item.objectDetection?.bottomRight.x || 0}, {item.objectDetection?.bottomRight.y || 0}) <br />
              Canvas: {item.objectDetection?.canvasSize.width} x {item.objectDetection?.canvasSize.height}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroppableCanvas;


