import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-autocomplete';
import { handleKeyPressOBDet, handleKeyPressOBJCOLOR } from "../utils/ServicesUtils";
import { useOBDetResult } from '../../contexts/OBDetsearchContext';
import { useModeContext } from '../../contexts/searchModeContext';
import { useClipConfig } from '../../contexts/ClipSearchConfigContext';
import DroppableCanvas, { DraggableIcon, DraggableColor } from '../ObjectDet/Canvas';
import Switch from "react-switch";




const ObjectDetectionPanel = ({ numImages, setNumImages }) => {
  const { setOBDetResult } = useOBDetResult();
  const { setSearchMode } = useModeContext();
  const { setClipConfig } = useClipConfig();
  const [OBDetquery, setOBDetquery] = useState('');
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [items, setItems] = useState([]); // Items from JSON
  const [ObtDetMode, setObtDetMode] = useState('slow');
  const [ismodeSwitchChecked, setismodeSwitchChecked] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const [icons, setIcons] = useState([]);

  const [colors, setcolors] = useState([]);


  // Fetch JSON data and set items and icons
  useEffect(() => {
    fetch('/class_names.json') // Replace with the correct path
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        // Create icons dynamically from JSON data
        const createdIcons = data.map(item => ({
          id: item.id.toString(),
          label: item.name,
          src: item.name

        }));
        setIcons(createdIcons);
      })
      .catch((error) => console.error('Error loading items:', error));
  }, []);


  useEffect(() => {
    fetch('/color_palletes.json')
      .then((response) => response.json())
      .then((data) => {
        setcolors(data);
      })
      .catch((error) => console.error('Error loading items:', error));
  }, []);


  // Canvas dropping
  const handleDragStart = (e, icon) => {
    e.dataTransfer.setData('icon', JSON.stringify(icon));
  };

  const handleDrop = (e) => {
    const data = e.dataTransfer.getData('icon');
    const droppedItemData = e.dataTransfer.getData('dropped-item');

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - canvasRect.left;
    const dropY = e.clientY - canvasRect.top;

    if (data) {
      const icon = JSON.parse(data);
      setDroppedItems([...droppedItems, { ...icon, x: dropX, y: dropY }]);
    } else if (droppedItemData) {
      const item = JSON.parse(droppedItemData);
      const updatedItems = [...droppedItems];
      updatedItems[item.index] = { ...updatedItems[item.index], x: dropX, y: dropY };
      setDroppedItems(updatedItems);
    }
  };

  const handleDelete = (index) => {
    setDroppedItems(droppedItems.filter((_, i) => i !== index));
  };

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handlemodeSwitch = (checked) => {
    setismodeSwitchChecked(checked);
    setObtDetMode(checked ? "fast" : "slow");
  };

  const handleInputChange = (e) => {
    setOBDetquery(e.target.value);
    const lastpart = e.target.value.split(' ').pop();
    const lastWord = lastpart.split('-').pop();
    setAutocompleteValue(lastWord);
  };

  const handleSelect = (value) => {
    const parts = OBDetquery.split(' ');
    const lastInstance = parts[parts.length - 1];
    const splatsRemove = lastInstance.split('-');
    splatsRemove[1] = value;
    const newLastValue = `${splatsRemove.join('-')}`;
    parts[parts.length - 1] = newLastValue;
    const newValue = `${parts.join(' ')}`;
    setOBDetquery(newValue);
  };

  const getSuggestions = (value) => {
    const input = value.trim();
    if (input.length === 0) return [];
    return items.filter(item => item.name.includes(input));
  };

  const handleCanvasKeyPress = (e, droppedItems) => {
    if (e.key === 'Enter') {
      console.log("Dropped items", droppedItems)
    }
  };

  return (
    <div className='w-full h-full mb-5 items-center'>
      <h2 className="text-lg font-bold mb-4">Objects & Colors of the Scene</h2>

      <div className="flex flex-col items-center">

        <div className="grid grid-cols-12 gap-0.5 mb-4">
          {icons.map((icon) => (
            <DraggableIcon key={icon.id} icon={icon} onDragStart={handleDragStart} />
          ))}
        </div>

        <div className="grid grid-cols-8 gap-2 mb-4">
          {colors.map((color) => (
            <DraggableColor key={color.id} icon={color} onDragStart={handleDragStart} />
          ))}
        </div>

        <div>
          <DroppableCanvas
            droppedItems={droppedItems}
            handleDrop={handleDrop}
            handleDelete={handleDelete}
            onKeyPressFunction={handleCanvasKeyPress} // Add keypress event to the canvas
            tabIndex={0} // Make the canvas focusable to capture keypress events
          />
        </div>
      </div>

      {/* Autocomplete and other elements remain unchanged */}
      <div className="flex items-center justify-center my-4 gap-2">
        <label>slow</label>
        <Switch onChange={handlemodeSwitch} checked={ismodeSwitchChecked} />
        <label>fast</label>
      </div>

      <div className="w-full justify-center text-mode-options pt-5"
        onKeyPress={(e) => {
          handleKeyPressOBDet(e, OBDetquery, numImages, ObtDetMode, setOBDetResult, setSearchMode);
        }}
        onChange={autoResize}
      >
        <Autocomplete
          getItemValue={(item) => item.name}
          items={getSuggestions(autocompleteValue)}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.id}
              className={`px-4 py-2 cursor-pointer ${isHighlighted ? 'bg-gray-200' : 'bg-white'}`}
            >
              {item.name}
            </div>
          )}
          value={OBDetquery}
          onChange={handleInputChange}
          onSelect={handleSelect}
          inputProps={{
            className: "shadow appearance-none border-2 rounded border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            placeholder: "Enter queries like '2 person 1 car'",
          }}
          menuStyle={{
            className: 'absolute left-0 right-0 bg-white shadow-lg max-h-10 overflow-y-auto z-10 rounded-lg border border-gray-200',
          }}
        />
      </div>
    </div>
  );
};

export default ObjectDetectionPanel;