
const renderImagesSimilarityForm = (ImageSimiResult,setImageSimformVisible , selectedImage, handleImageClick, handleDoubleClick, handleClickImgSim,ClipConfig,  setImageSimiResult) => (
    <div className=" h-1/2 w-full bg-opacity-50 flex items-center justify-center z-50">
       <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={() => setImageSimformVisible(false)}>Close</button>
      <div className="overflow-y-auto max-h-[50vh] bg-white p-4 rounded w-full h-full">
        <div className="h-full grid grid-cols-5 gap-2">
          {ImageSimiResult.map((img, index) => (
            <div className={`border p-1 bg-white ${selectedImage === `${img.video_name}-${img.keyframe_id}` ? 'border-4 border-red-500' : 'border-gray-300'}`}>
              <img
                key={index}
                src={`${process.env.REACT_APP_IMAGE_PATH}/${img.video_name.slice(0, 3)}/${img.video_name}/${img.keyframe_id}.jpg`}

                className="w-full h-auto"
                alt={img.img_id}
                onClick={() => handleImageClick(img.video_name, img.keyframe_id)}
                onDoubleClick={() => handleDoubleClick(img.video_name, img.keyframe_id)}
              />
              <div className='flex'>
                <img className="w-8 p-0.5 rounded-md hover:bg-black"
                    src={'./imgSim.png'}
                    onClick={() => {
                      handleClickImgSim(img.video_name ,img.keyframe_id,  ClipConfig,  setImageSimiResult, setImageSimformVisible)
                    }} 
                    alt="img-sim">
                </img>
              </div>
              {img.video_name} { img.keyframe_id }.jpg
              
            </div>
          ))}
        </div>
       
      </div>
    </div>
  );

export default renderImagesSimilarityForm