function getvibs(file,xyz,molview) {
  const vibdial = document.getElementById("vib-dialog");
  const vibclose = document.getElementById("vib-close");
  vibdial.show();
  dragElement(vibdial);
  vibclose.addEventListener("click", () => {
    vibdial.close();
  });
  var newxyz = "3\n\n O -0.1422831649 -0.1033009247 -0.0000000000 -0.5 0.5 0.5\n H -0.8033894329 0.6002287619 0.0000000000 0.0 0.0 0.0\n H -0.6073714722 -0.9492950531 0.0000000000 0.0 0.0 0.0"
  molview.clear();
  molview.addModel(newxyz,"xyz");
  molview.setStyle({}, { stick: {}, sphere: {radius: 0.4} }); 
  molview.zoomTo();
  molview.render();
  molview.vibrate(10,1,true);
  molview.animate({loop: "backandforth"});
  return;
}


// Make the DIV element draggable:

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    console.log("offsetLeft = " + elmnt.offsetLeft);
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

