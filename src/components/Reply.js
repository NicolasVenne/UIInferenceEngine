import React, {useState, useEffect, useRef} from 'react';
import anime from "animejs";

function Reply(props) {

    const [anim, setAnim] = useState("");
    const messageElm = useRef(null);
    var diagnosisArray = useRef([]);

    useEffect(() => {
        if(props.incoming) {
            setAnim("animation incoming")
            setTimeout(() => {
                setAnim("show");
            }, 1500)
        } else if(props.animate) {
            setAnim("animation")
            setTimeout(() => {
                setAnim("show");
            }, 1500)
        } else {
            setAnim("show")
        }

    }, [props.incoming, props.animate])

    useEffect(() => {
        
        for(let key in props.diagnosis) {
            diagnosisArray.current.push({name: key, ...props.diagnosis[key]})
        }
        diagnosisArray.current.sort((a,b) => {
            return b.certainty - a.certainty;
        })


        setTimeout(() => {
            for(let key in props.diagnosis) {
            

                props.diagnosis[key].display = "";
                anime({
                    targets: props.diagnosis[key],
                    display: props.diagnosis[key].certainty * 100 + "%",
                    round: 1,
                    easing: 'linear',
                    delay: 700,
                    update: function() {
                        messageElm.current.querySelector(".text."+key).innerHTML = props.diagnosis[key].display;
                    }
                })
                anime({
                    targets:  messageElm.current.querySelector(`.circle.${key}`),
                    delay: 700,
                    strokeDashoffset: ['250', 250 - props.diagnosis[key].certainty * 250],
                    easing: 'easeInOutQuad'
                  });
            }
        },10)
    },[props.diagnosis])

    return (
        <div className={`reply ${anim !== "" ? "show" : ''}`}>
            <h1 className={anim}>{props.title}</h1>
            <div className={`message ${anim}`} ref={messageElm}>
                {diagnosisArray.current.map((val, index) => {
                    
                    return <div key={val.name} className="diagnosis">
                        <h2>{val.name.replace("_", " ")}</h2>
                        <div className="item html" >
                            <h2 className={`text ${val.name}`}></h2>
                            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                <g>
                                    <title>Layer 1</title>
                                    <circle className={`circle_animation circle ${val.name}`}  r="40" cy="50" cx="50" strokeWidth="8"  fill="none"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                })}
            </div>
        </div>
    );
}

export default Reply;