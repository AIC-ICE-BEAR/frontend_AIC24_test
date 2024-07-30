import React, { useState } from 'react';
import axios from 'axios';
import logo from '../logo.svg';
function SidebarApp() {
      const [queryMode, setQueryMode] = useState('text');
      const [numImages, setNumImages] = useState(20);
      const [model, setModel] = useState('ViT-B/32');
      const [query, setQuery] = useState('abcd');
      const [results, setResults] = useState([]);
      const [QueryLanguage,setQueryLanguage] =  useState('English');
      console.log("##########################")
      console.log(queryMode)
      console.log(numImages)
      console.log(model)
      console.log(query)
      console.log(QueryLanguage)

      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          console.log("send request")
          if (queryMode === "text"){
            sendrequets_clip();
          }
          else if (queryMode === "ocr"){
            sendrequets_ocr();
          }
        }
      };
      const sendrequets_clip = async () => {
        try {
            const response = await axios.post('http://localhost:8000/search', {"query": [query], "k": numImages, "model": model,"language":QueryLanguage});

            console.log(response.data);
            setResults(response.data)
            console.log(results)
        }
        catch (error) {
            if (error.response) {
                alert(`Search failed: ${error.response.data.detail}`);
            } else {
                alert('failed: Network error');
            }
        }
        
      };
      const sendrequets_ocr = async () => {
        try {
            const response = await axios.post('http://localhost:8000/search_OCR', {"query": [query], "k": numImages});

            console.log(response.data);
            setResults(response.data)

        }
        catch (error) {
            if (error.response) {
                alert(`Search failed: ${error.response.data.detail}`);
            } else {
                alert('failed: Network error');
            }
        }
        
      };
      //hàm xử lí trong react
      // const [path2img,setPath2img]=useState('')
      const extract_name_img=(vid_name,kf_id)=>{
            // Chuyển số thành chuỗi và thêm các số 0 ở đầu cho đủ 4 ký tự
            let formattedNumber = kf_id.toString().padStart(4, '0');
            // Thêm đuôi '.jpg'
            let name_img= `${formattedNumber}.jpg`;
            // setPath2img(name_img)
            return name_img
      }

      return (// trong mỗi chỗ return v tất cả thẻ liền kề(cùng cấp) phải được bao bọc bởi 1 thẻ đóng

        <div className="body-app">
          <div className="query-controls">
            <div className="query-mode">
                <label>Query Mode
                  <br></br>
                  <label>Text</label> 
                  <input type="radio" name="queryMode" value="text" checked={queryMode === 'text'}
                    onChange={(e) => setQueryMode(e.target.value)}></input><br/>
                    {/* giá trị thẻ này mang là 'text', khi chọn thì nó sẽ gán giá trị này cho biến queryMode */}
                  <label>Image</label> 
                  <input type="radio" name="queryMode" value="image" checked={queryMode === 'image'}
                    onChange={(e) => setQueryMode(e.target.value)}></input><br></br>
                  <label>OCR</label> 
                  <input type="radio" name="queryMode" value="ocr"checked={queryMode === 'ocr'}
                    onChange={(e) => setQueryMode(e.target.value)}/><br/>
                </label>
              </div>
            <label>
              Number of Images return:
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={numImages} 
                onChange={(e) => setNumImages(e.target.value)} 
              />
              {numImages}
            </label>
            <br></br>{/*xuống dòng*/}
            {queryMode === 'text' && (
                  <div className="text-mode-options">
                    <label>
                      Model
                      <select value={model} onChange={(e) => setModel(e.target.value)}>
                        <option value="ViT-B/32">ViT-B/32 nè</option>
                        <option value="L14">L14 nè</option>
                        <option value="BigG14">BigG14 nè</option>
                      </select>
                    </label>
                    <br />
                    <label>
                      Query Language
                      <select value={QueryLanguage} onChange={(e)=>setQueryLanguage(e.target.value)}>
                        <option value="English" >English</option>
                        <option value="Vietnamese" >Vietnamese</option>
                      </select>
                    </label>
                    <br />
                    <label>
                      Query
                      <input type="text" placeholder='fill query and press enter' value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress}/>
                      {/* vd để value="hello" thì giá trị trong cái ô nhập text luôn là hello ko sửa được , => value là thuộc tính chứa cái giá trị trong ô nhập text á
                      vd value={query} để đồng bộ trường nhập liệu vs biến query, trường này mang giá trị gì thì query mag gtri đó và ngc lại, ns chung value chứa giá trị của trường nhập liệu.
                      còn onChange là khi có thay đổi trong ô nhập text thì sẽ cập nhật giá trị cho biến query bằng giá trị được nhập vô hay
                      là nó giúp thực hiện đồng bộ giữa giá trị trg nhập liệu mang với query, khi gtri trog trường nhập liệu thay đổi nó giúp cập nhật gtri cho cái biến*/}
                    </label>
                  </div>
                )}

            {queryMode === 'ocr' && (
                  <div className="ocr-mode-options">
                    <label>
                      Query
                      <input type="text" placeholder='fill query and press enter' value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress}/>
                    </label>
                  </div>
                )}
          </div>
          <div >
            <label>Result</label>
                {/* mở {} để chèn mã js , chỗ này là nếu biến này có giá trị >0 thì hiển thị cái này */}
                {results.search_result &&(
                  <div className="result">
                    {results.search_result.map((item, index) => (
                                <div key={index} className="image-item">
                                  <p>Video Name: {item.video_name}</p>
                                  <p>Keyframe ID: {item.keyframe_id}</p>
                                  <p>Score: {item.score}</p>
                                  {/* <img src={logo} className="App-logo" alt="logo" /> */}
                                  {/* cần có hàm extreact file img name ở đoạn này */}
                                  {/* <img src={`${process.env.PUBLIC_URL}/key_frames/Keyframes_L01/L01_V001/0002.jpg`} className="img" alt={item.keyframe_id}/> */}
                                  <img src={`${process.env.PUBLIC_URL}/key_frames/Keyframes_`+item.video_name.slice(0,3)+'/'+item.video_name+'/'+ extract_name_img(item.video_name,item.keyframe_id)} className="img" alt={item.keyframe_id}/>
                                  <p>{`${process.env.PUBLIC_URL}/key_frames/Keyframes_`+item.video_name.slice(0,3)+'/'+item.video_name+'/'+ extract_name_img(item.video_name,item.keyframe_id)}</p>
                                </div>
                                
                              ))}

                  </div>
                )}
          </div>
        </div>
        );
}


export default SidebarApp;
