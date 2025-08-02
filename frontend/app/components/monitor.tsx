import Webcam from 'react-webcam';

function Monitor(props) {
    return (
        <div>
            <div className="camView">
                {props.show &&
                    <Webcam 
                        audio={false} 
                        ref={props.video_element} 
                        videoConstraints={props.videoConstraints} 
                        screenshotFormat="image/jpeg" 
                    />
                }
            </div>
            <button onClick={props.toggle}>{props.show ? "Stop" : "Start"}</button>

            <div className="analyzed">
                <img src={props.data ? `data:image/jpeg;base64,${props.data[0]}` : undefined} />
            </div>
        </div>
    )
}

export default Monitor