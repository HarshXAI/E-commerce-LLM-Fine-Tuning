import React from 'react';
import { orbit } from 'ldrs'

function Loader() {
    orbit.register();
    return (
        <l-orbit
          size="35"
          speed="1.5" 
          color="white" 
        ></l-orbit>
    );
}

export default Loader;




// Default values shown
