import React, {useState, useEffect, useRef} from 'react';

function Select(props) {

    const [anim, setAnim] = useState("");
    const [isSelected, setIsSelected] = useState();

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

    function select(val) {
        props.inputRef.current = {};
        props.inputRef.current.value = val;
        setIsSelected(val);
        props.onSelect()
    }

    return (
        <div className={`selectInput ${anim !== "" ? "show" : ''} ${props.options.length === 2 ? "two" : ""}`}>
            <h1 className={anim}>{props.title}</h1>
            {props.options.map((val, index) => {
                return (
                    <button key={index} className={`${anim} ${isSelected === val ? "selected" : ""}`} onClick={() => {select(val)}} disabled={!props.incoming}>{val}</button>
                )
            })}
        </div>
    );
}

export default Select;