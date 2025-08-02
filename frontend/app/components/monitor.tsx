import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function Monitor(props) {
    const [show, set_show] = useState(false);
    const video_element = useRef(null);
    const interval = useRef(null);
    const [data, set_data] = useState(null);
    let counter = 0;
    const threshold = 40;
    const interval_time = 250;
    
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    const analyze = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/processImage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image: String(video_element.current.getScreenshot())}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error processing image.");
            }

            const dat = await response.json();
            set_data(dat);

            var has_fallen = false;
            dat[1].forEach((result: number[]) => {
                has_fallen ||= (result[5] == 0);
            })

            if(has_fallen){
                ++counter;
            } else {
                counter = 0;
            }
            
            if(counter == threshold){
                await fetch('http://127.0.0.1:8000/emergencyCall', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: "",
                });

                stopCam();
            }
            
        } catch (error) {
            console.error("Error during processing:", error);
        }
    }

    const startCam = () => {
        set_show(true);
        interval.current = setInterval(analyze, interval_time);
    }

    const stopCam = () => {
        let stream = video_element.current.stream;
        const tracks = stream.getTracks();
        tracks.forEach((track: { stop: () => any; }) => track.stop());
        set_show(false);

        clearInterval(interval.current);
        interval.current = null

        set_data(null);
    }

    const toggle = () => {
        if(show){
        stopCam();
        } else {
        startCam();
        }
    }

    return (
        <div className="bg-brand-gray min-h-screen font-sans">
            <main>
                <section className="text-center py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
                        Video Feed
                        </h1>

                        <div className="container">
                            <div className="item camView">
                                {show &&
                                    <Webcam 
                                        audio={false} 
                                        ref={video_element} 
                                        videoConstraints={videoConstraints} 
                                        screenshotFormat="image/jpeg" 
                                    />
                                }
                            </div>

                            <div className="item analyzed">
                                <img src={show && data ? `data:image/jpeg;base64,${data[0]}` : undefined} />
                            </div>
                        </div>

                        <button 
                            onClick={toggle} 
                            className={
                                show ? 
                                "bg-brand-red text-lg font-bold text-brand-text text-white py-3 px-6 rounded-lg hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red" :
                                "bg-brand-green text-lg font-bold text-brand-text text-white py-3 px-6 rounded-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                            }
                        >
                            {show ? "Stop" : "Start"}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Monitor