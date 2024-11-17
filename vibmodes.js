function getvibs(prog,file,irinfo,xyz,molview) {
  const vibdial = document.getElementById("vib-dialog");
  const vibclose = document.getElementById("vib-close");
  const vibform = document.getElementById("vib-form");
  vibdial.show();
  dragElement(vibdial);
  vibclose.addEventListener("click", () => {
    vibdial.close();
  });
  makevibform(irinfo);
  vibform.addEventListener("submit", (e) => animatevib(prog,file,irinfo,xyz,molview))
  return;
}

function animatevib(prog,file,irinfo,xyz,molview) {
  var choice = getRadioButtonValue("radio-group");
  console.log(choice);    // DEBUG
  var newxyz;
  switch(prog) {
    case "gamess":
      newxyz = "3\n\n O -0.1422831649 -0.1033009247 -0.0000000000 -0.5 0.5 0.5\n H -0.8033894329 0.6002287619 0.0000000000 0.0 0.0 0.0\n H -0.6073714722 -0.9492950531 0.0000000000 0.0 0.0 0.0"
      break;
    case "nwchem":
      newxyz = "3\n\n O -0.1422831649 -0.1033009247 -0.0000000000 -0.5 0.5 0.5\n H -0.8033894329 0.6002287619 0.0000000000 0.0 0.0 0.0\n H -0.6073714722 -0.9492950531 0.0000000000 0.0 0.0 0.0"
      break;
    case "orca":
      newxyz = "3\n\n O -0.1422831649 -0.1033009247 -0.0000000000 -0.5 0.5 0.5\n H -0.8033894329 0.6002287619 0.0000000000 0.0 0.0 0.0\n H -0.6073714722 -0.9492950531 0.0000000000 0.0 0.0 0.0"
      break;
    case "psi4":
      newxyz = "3\n\n O -0.1422831649 -0.1033009247 -0.0000000000 -0.5 0.5 0.5\n H -0.8033894329 0.6002287619 0.0000000000 0.0 0.0 0.0\n H -0.6073714722 -0.9492950531 0.0000000000 0.0 0.0 0.0"
      break;
  }
  molview.clear();
  molview.addModel(newxyz,"xyz");
  molview.setStyle({}, { stick: {}, sphere: {radius: 0.4} }); 
  molview.zoomTo();
  molview.render();
  molview.vibrate(10,1,true);
  molview.animate({loop: "backandforth"});
}

function makevibform(irobj) {
  // Data for radio button options
//const options = ["Option 1", "Option 2", "Option 3"];
  const options = irobj.vibfreq

  // Get the container where you want to add the radio buttons
  const form = document.getElementById("vib-form");
  form.method = "dialog";
  form.innerHTML = "";
//form.innerHTML = "<br>Select the frequency of the vibrational " + 
//   "mode you want to animate. Then click " +
//   "\"Animate\" followed by \"Close\".<br><br>";

  var modenum = 0;

  // Create radio buttons dynamically
  options.forEach(option => {
    // Create the radio button element
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "radio-group";
    radio.value = option;

    // Create the label element
    const label = document.createElement("label");
    label.textContent = option;

    // Append the radio button and label to the container
    form.appendChild(radio);
    form.appendChild(label);
    form.appendChild(document.createElement("br")); // Add a line break

    modenum = modenum + 1;
  });
  const choice = getRadioButtonValue("radio-group");
  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Animate";
  form.appendChild(submit);
}

function getRadioButtonValue(radioGroupName) {
  const radioButtons = document.querySelectorAll(`input[name="${radioGroupName}"]`);

  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }
  return null;
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
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

