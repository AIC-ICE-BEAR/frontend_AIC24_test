


const renderNextImagesForm = (nextImages, selectedImage, handleImageClick, handleDoubleClick, setFormVisible) => (
  <div className=" h-screen fixed top-20 left-0 z-50 w-full  bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded">
      <h2 className="text-2xl mb-4">Surrounded images</h2>
      <div className="overflow-y-auto h-screen grid grid-cols-5 gap-2">
        {nextImages.map((img, index) => (
          <div className={`border p-1 bg-white ${selectedImage === `${img.video_name}-${img.img_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}>
            <img
              key={index}
              src={`${process.env.REACT_APP_IMAGE_PATH}/${img.video_name}/${img.img_id}.jpg`}

              className="w-full h-auto"
              alt={img.img_id}
              onClick={() => handleImageClick(img.video_name, img.img_id)}
              onDoubleClick={() => handleDoubleClick(img.video_name, img.img_id)}
            />




            {img.video_name} {img.img_id}.jpg
          </div>
        ))}

      </div>
      <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => setFormVisible(false)}>Close</button>
    </div>
  </div>
);


export default renderNextImagesForm;