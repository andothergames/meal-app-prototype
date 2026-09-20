// PLUG INS
gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(DrawSVGPlugin);


//DOM listeners
const plate = document.getElementById('plate');
const ingredientSelect = document.getElementById('ingredient-select');


//AUDIO
const slurp = document.getElementById('slurp');
const chop = document.getElementById('chop');
const drop = document.getElementById('drop');
const splat = document.getElementById('splat');
const shake = document.getElementById('shake');


// VARIABLES

// storage for all placed ingredients on plate
const mealState = {
    ingredients: []
}

// SVG PATHS

// path stitched together from Shapes available at https://www.shapes.gallery/
const pepperSVG = "M 64 0 C 64 35.346 92.654 64 128 64 L 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 L 128 64 C 163.346 64 192 35.346 192 0 Z"

// path exported from my own Affinity Design Illustration
const noodleSVG = "M 201,516C201,516 188.767,185.614 502.5,210C502.5,210 1050.29,254.409 814,592C762.073,666.19 126.376,1066.05 348,156C348,156 366.357,54.057 476,80C476,80 1196.5,154.333 579,754C527.719,803.8 167.499,951.079 281,462C281,462 361.575,177.697 579,344C579,344 766.493,540.34 785,675"

// path exported from my own Affinity Design Illustration
const sauceSVG = "M 42.835,102.451C42.835,79.897 34.916,81.767 32.423,66.372C31.124,58.347 33.93,44.16 39.237,39.709C58.347,23.68 61.204,22.944 90.626,16.94C116.43,11.674 127.564,18.961 139.258,23.631C144.355,25.667 169.662,47.428 173.249,57.495C182.669,83.925 176.441,88.344 179.991,98.438C185.135,113.064 193.854,121.758 180.65,143.739C175.655,152.054 156.323,162.36 133.155,158.925C91.725,152.783 84.934,149.54 80.843,148.316C37.91,135.47 42.835,102.451 42.835,102.451 Z"

// path exported from my own Affinity Design Illustration
const sauceSplatSVG = "M 46.835,105.451C46.835,82.897 34.916,81.767 32.423,66.372C31.124,58.347 41.93,32.16 47.237,27.709C66.347,11.68 59.204,38.944 95.626,15.94C117.892,1.877 120.564,23.961 132.258,28.631C137.355,30.667 166.662,44.428 170.249,54.495C179.669,80.925 161.441,89.344 164.991,99.438C170.135,114.064 180.854,117.758 167.65,139.739C162.655,148.054 154.323,143.36 131.155,139.925C89.725,133.783 70.897,150.062 56.843,144.316C44.46,139.253 46.835,105.451 46.835,105.451 Z"


// changes on click, initially set to the first entry in drop down
let selectedIngredient = 'sauce';
// used to number ingredients
let nextID = 0;

// object stores ingredient values and function calls
const ingredientRefs = {
    tofu: {
        create: createTofu,
        animate: stamp,
        size: 50,
        sound: drop
    },
    sauce: {
        create: createSauce,
        animate: splodge,
        size: 180,
        sound: splat
    },
    pepper: {
        create: createPepper,
        animate: bounce,
        size: 50,
        sound: chop
    },
    herbs: {
        create: createHerbs,
        animate: sprinkle,
        size: 80,
        count: 9,
        sound: shake
    },
    noodle: {
        create: createNoodle,
        animate: draw,
        size: 50,
        sound: slurp
    }

};

//coords to set boundaries in
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

    //current length of mealState used to number the next ID
    //create new ingredient instance to add to plateState
    const instance = {
        id: nextID,
        i,
        x,
        y,
        size: ingredientRefs[i].size,
        count: ingredientRefs[i].count,
        rotation: random(-180, 180),
        scale: random(0.8, 1.4)
    };

    // increment ID for next ingredient
    nextID++
    //add ingredient to the array
    mealState.ingredients.push(instance);
    // using functions from actions object instead of if statements
    const action = ingredientRefs[i];
    const element = action.create(instance);
    action.animate(element)
    ingredientRefs[i].sound.play()
}


// CREATE SVG INGREDIENTS

function createTofu(i) {
    const side = i.size * i.scale
    // dividing the size by two to ensure cube appears in center of click
    const center = -side / 2
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    //setting group attributes to translate
    group.setAttribute("class", "tofu");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y})`
    );

    // creating rect element
    const body = document.createElementNS(
        "http://www.w3.org/2000/svg", "rect"
    )

    // setting body attributes to style the tofu rectangle
    body.setAttribute("width", side)
    body.setAttribute("height", side)
    body.setAttribute("x", center)
    body.setAttribute("y", center)
    //rx/ry rounds the corners
    body.setAttribute("rx", "4")
    body.setAttribute("ry", "4")
    body.setAttribute("fill", "blanchedalmond")
    body.setAttribute("fill-opacity", "80%")

    //appends the body to the group, the group to the plate
    group.appendChild(body);
    plate.appendChild(group);
    return group;
}

function createPepper(i) {
    //original SVG drawing is 256 wide, scaling it to match the ingredientRefs
    const scale = (i.size * i.scale) / 256;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.setAttribute("class", "pepper");

    const body = document.createElementNS(
        "http://www.w3.org/2000/svg", "path"
    )
    // using "d" for path
    body.setAttribute("d", pepperSVG)
    body.setAttribute("fill", "red")
    body.setAttribute("fill-opacity", "80%")

    group.appendChild(body);
    plate.appendChild(group);

    //using gsap to set the placement
    gsap.set(group, {
        x: i.x,
        y: i.y,
        rotation: i.rotation,
        scale: scale,
        transformOrigin: "0 0"
    });

    return group;

}

function createHerbs(i) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "herbs");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y})
        rotate(0)`
    );

    // looping to create a herb for eachcount from ingredientRefs
    for (let j = 0; j < i.count; j++) {
        // generate a random angle from enter (0) to travel in
        const angle = random(0, Math.PI * 2);
        // generate distance between 30 and size from ingredientRef
        const distance = random(30, i.size);
        //calculate x and y coords to travel in
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        //randomly generated green and blue values
        const green = Math.round(random(180, 255))
        const blue = Math.round(random(40, 80))

        const body = document.createElementNS(
            "http://www.w3.org/2000/svg", "rect"
        )
        body.setAttribute("class", "herb")
        body.setAttribute("width", 2)
        body.setAttribute("height", 12)
        body.setAttribute("rx", 1)
        body.setAttribute("x", x)
        body.setAttribute("y", y)
        body.setAttribute("fill", `rgb(20, ${green}, ${blue})`)
        body.setAttribute("transform",
            `rotate(${random(0, 360)} ${x} ${y})`)
        group.appendChild(body)
    };
    plate.appendChild(group);
    return group;
}

function createNoodle(i) {
    // rescaling
    const scale = (i.size * i.scale) / 220;

    //centering the noodle to appear in center with bodged maths
    const x = (126 + 1196) / 2
    const y = (54 + 1066) / 2
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.setAttribute("class", "noodle");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y})
        rotate(${i.rotation})
        scale(${scale})
        translate(${-x} ${-y})`
    );

    const body = document.createElementNS(
        "http://www.w3.org/2000/svg", "path"
    )

    body.setAttribute("d", noodleSVG)
    body.setAttribute("fill", "none")
    body.setAttribute("stroke", "burlywood")
    body.setAttribute("stroke-width", 20)
    body.setAttribute("stroke-linecap", "round")

    group.appendChild(body);
    plate.appendChild(group);
    return body;

}


function createSauce(i) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.setAttribute("class", "sauce");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y})
        rotate(${random(-180, 180)})
        translate(-113 -88)`
    );

    const body = document.createElementNS(
        "http://www.w3.org/2000/svg", "path"
    )

    body.setAttribute("d", sauceSVG)
    body.setAttribute("fill", "rgba(250, 95, 95, 0.9)")

    group.appendChild(body);
    plate.appendChild(group);
    return body;
}


// ANIMATION FUNCTIONS

//STAMP

function stamp(element) {

    // setting rotations randomly for the timeline
    const startingRotation = random(-80, 80);
    const landingRotation = random(-35, 35);

    //creating a timeline chain of scaling up and down whilst rotating
    gsap.set(element, {
        scale: 0.55,
        rotation: startingRotation,
        transformOrigin: "center center"
    });
    gsap.timeline()
        .to(element, {
            scale: 1.1,
            rotation: landingRotation,
            duration: 0.28,
            //using ease to smooth transitions
            ease: "power2.out"
        })
        .to(element, {
            scale: 1,
            duration: 0.28,
            ease: "back.out(2)"
        })
}


//BOUNCE

function bounce(element) {

    gsap.timeline()
        .to(element, {
            //y positioning to raise and lower the element
            y: "-=20",
            duration: 0.2,
        })
        .to(element, {
            y: "+=20",
            duration: 0.5,
            //using ease for bounce effect
            ease: "bounce.out"
        })
}


//SPLODGE

function splodge(element) {

    gsap.set(element, {
        transformOrigin: "center center"
    });

    gsap.timeline()
        .to(element, {
            //morphSVG plug in moves from one SVG to another
            morphSVG: sauceSplatSVG,
            scale: 1.2,
            duration: 0.5,
        })
        .to(element, {
            scale: 1,
            duration: 0.5,
        })
        .to(element, {
            morphSVG: sauceSVG,
            duration: 0.5,
        })
}


//SPRINKLE

function sprinkle(element) {

    //take the elements children and pass it into an array
    const dashes = [element.children];

    gsap.set(dashes, {
        //set y coordinates higher to appear as if falling
        y: -50,
        //they start smaller in scale
        scale: 0.2,
        //and invisible through opacity
        opacity: 0
    });

    gsap.to(dashes, {
        //it works towards full opacity, size and the correct y position
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.32,
        //stagger to randomly pop up herbs at 0.025 increments
        stagger: {
            each: 0.025,
            from: "random"
        },
        ease: "back.out(2)",
        //+= to rotate either way by 180 degrees
        rotation: "+=" + random(-180, 180),
    })
}

//DRAW

function draw(element) {
    gsap.set(element, {
        //using drawSVG plug in from 0% to 100%
        drawSVG: "0%"
    });

    gsap.to(element, {
        drawSVG: "100%",
        duration: 1.2,
        //using steps ease for a stuttery effect 
        //appears in three steps
        ease: "steps(3)"
    })
}


// UTIL FUNCTIONS

//returns whole number within range
function random(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

//changes selected ingredient on drop down change
function changeSelectedIngredient() {
    selectedIngredient = ingredientSelect.value;
}

//determines if cursor is inside plate area using radius equation
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