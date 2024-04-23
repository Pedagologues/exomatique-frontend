import { DependencyList, useEffect, useRef } from "react";

export default function useEffectOnce(callback: (()=>void), deps?: DependencyList) : React.MutableRefObject<boolean>{
    const fetched = useRef(false)
    let deps_ : unknown[] = deps ? deps as unknown[] : [];
    deps_.push(callback)
    useEffect(()=>{
        if(fetched.current) return;
        fetched.current = true
        callback();

    }, deps_)

    return fetched;
}