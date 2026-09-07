//DOM listeners
const plate = document.getElementById('plate');
const ingredientSelect = document.getElementById('ingredient-select');

// storage for all placed ingredients on plate
const mealState = {
    ingredients: []
}

// this will change on click, initially set to the first entry in drop down
let selectedIngredient = 'tofu';
let nextID = 0;


// object stores ingredient interaction refs and sizes
const ingredientRefs = {
    tofu: {
        behaviour: "stamp",
        size: 50
    },
    sauce: {
        behaviour: "splodge",
        size: 800
    },
    pepper: {
        behaviour: "stamp",
        size: 20
    },
    herbs: {
        behaviour: "sprinkle"
    }

};


const PLATE = {
    centerX: 420,
    centerY: 420,
    radiusX: 340,
    radiusY: 340,
}



//EVENT LISTENERS

ingredientSelect.addEventListener("change", changeSelectedIngredient);

//using pointer down event rather than click for future implementation of drawing with cursor
plate.addEventListener("pointerdown", (e) => {
    //use getPointerPosition to convert the event screen coords in relation to SVG coords and check if inside the plate boundary
    const { x, y } = getPointerPosition(e);
    //if pointer in bounds of plate add ingredient
    if (!isInsidePlate(x, y)) {
        return;
    }
    addIngredient(selectedIngredient, x, y)
});





//FUNCTIONS

function addIngredient(i, x, y) {
    const definition = ingredientRefs[i];
    console.log(ingredientRefs[i].size)

    //error handling for unknown type then exits out of function
    if (!definition) {
        console.log(`Unknown ingredient ${i}`)
        return;
    }

    //current length of mealState used to number the next ID
    //create new ingredient instance to add to plateState
    const instance = {
        id: nextID,
        i,
        x,
        y,
        size: ingredientRefs[i].size,
        rotation: random(-100, 100),
        scale: random(0.8, 1.4)
    };

    nextID++

    mealState.ingredients.push(instance);
    console.log(mealState)

    createPepper(instance);
}


//draws tofu SVG using ingredientRefs size

function createTofu(i) {
    side = i.size * i.scale
    center = -side / 2
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.setAttribute("class", "tofu");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y}) rotate(${i.rotation})`
    );

    const body = document.createElementNS(
        "http://www.w3.org/2000/svg", "rect"
    )

    body.setAttribute("width", side)
    body.setAttribute("height", side)
    body.setAttribute("x", center)
    body.setAttribute("y", center)
    body.setAttribute("rx", "4")
    body.setAttribute("ry", "4")
    body.setAttribute("fill", "blanchedalmond")
    body.setAttribute("fill-opacity", "80%")

    group.appendChild(body);
    plate.appendChild(group)
    return group;

}

function createPepper(i) {
    //original SVG drawing is 256 wide, scaling it to match the ingredientRefs
    const scale = (i.size * i.scale) / 256;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.setAttribute("class", "pepper");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y})
        rotate(${i.rotation})
        scale(${scale})`
    );

    const body = document.createElementNS(
        "http://www.w3.org/2000/svg", "path"
    )
    body.setAttribute("d", "M 64 0 C 64 35.346 92.654 64 128 64 L 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 L 128 64 C 163.346 64 192 35.346 192 0 Z")
    body.setAttribute("fill", "red")
    body.setAttribute("fill-opacity", "80%")

    group.appendChild(body);
    plate.appendChild(group)
    return group;

}

function createHerbs() {

}


//returns whole number within range given to random used to rotate and scale ingredients
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

//changes selected ingredient on drop down change
function changeSelectedIngredient() {
    selectedIngredient = ingredientSelect.value;
}

// function to decide if cursor is inside plate area using radius equation
function isInsidePlate(x, y) {
    const dx = (x - PLATE.centerX) / PLATE.radiusX;
    const dy = (y - PLATE.centerY) / PLATE.radiusY;
    return (dx * dx) + (dy * dy) <= 1;
}

//converting screen coords to the SVG's coordinate system
function getPointerPosition(event) {
    const point = plate.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const svgPoint = point.matrixTransform(plate.getScreenCTM().inverse());

    return {
        x: Math.round(svgPoint.x),
        y: Math.round(svgPoint.y)
    };

}