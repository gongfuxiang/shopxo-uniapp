// #ifdef H5
let listener;

const keyNames = {
    esc: ['Esc', 'Escape'],
    tab: 'Tab',
    enter: 'Enter',
    space: [' ', 'Spacebar'],
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    delete: ['Backspace', 'Delete', 'Del']
}

const setupKeyListeners = (props, emit) => {
    const onMounted = () => {
        listener = ($event) => {
            if (props.disable) {
                return
            }
            
            const keyName = Object.keys(keyNames).find(key => {
                const keyName = $event.key
                const value = keyNames[key]
                return value === keyName || (Array.isArray(value) && value.includes(keyName))
            })
            
            if (keyName) {
                // 避免和其他按键事件冲突
                setTimeout(() => {
                    emit(keyName, {})
                }, 0)
            }
        }
        
        document.addEventListener('keyup', listener)
    };
    
    const onUnmounted = () => {
        if (listener) {
            document.removeEventListener('keyup', listener)
        }
    };
    
    return {
        onMounted,
        onUnmounted
    };
}

export default setupKeyListeners;
// #endif