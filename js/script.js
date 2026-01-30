const canvas = document.getElementById('canvas');

function mouse_pos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: (event.clientY - rect.top)
    };
}

canvas.onmousemove = function (event) {
    let pos = mouse_pos(event);
    console.log(pos);

}