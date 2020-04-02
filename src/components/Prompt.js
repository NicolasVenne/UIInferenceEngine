import React, {useEffect, useState} from 'react';

function Prompt(props) {

    const [anim, setAnim] = useState("");

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
    
    return (
        <div className={`question ${anim !== "" ? "show" : ''}`}>
            <h1 className={anim}>{props.title}</h1>
			<input ref={props.inputRef} className={anim} disabled={!props.incoming}  type="text"></input>
        </div>
    );
}

export default Prompt;