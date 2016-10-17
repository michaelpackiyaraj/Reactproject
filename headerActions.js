var actionTypes = require('../constants/actionTypes');

export function toggleMenu(menuOpen){
    return {
        type: actionTypes.TOGGLE_MENU,
        menuOpen: !menuOpen
    };
}

export function hideMenu(){
    return {
        type: actionTypes.HIDE_MENU,
        menuOpen: false
    };
}