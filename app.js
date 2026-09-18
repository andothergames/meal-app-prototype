//DOM listeners
const plate = document.getElementById('plate');
const ingredientSelect = document.getElementById('ingredient-select');


// VARIABLES

// storage for all placed ingredients on plate
const mealState = {
    ingredients: []
}

// this will change on click, initially set to the first entry in drop down
let selectedIngredient = 'herbs';
let nextID = 0;

// object stores ingredient interaction refs and sizes
// also storing function calls within object
const ingredientRefs = {
    tofu: {
        create: createTofu,
        animate: stamp,
        size: 50
    },
    // sauce: {
    //     create: createSauce,
    //     animate: splodge,
    //     size: 800
    // },
    pepper: {
        create: createPepper,
        animate: spin,
        size: 50
    },
    herbs: {
        create: createHerbs,
        animate: sprinkle,
        size: 80,
        count: 9
    },
    noodle: {
        create: createNoodle,
        animate: placeholder,
        size: 50
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
    const element = action.create(instance)
    action.animate(element)
}


// CREATE SVG INGREDIENTS

function createTofu(i) {
    const side = i.size * i.scale
    // dividing the size by two to ensure cube appears in center of click
    const center = -side / 2
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    group.setAttribute("class", "tofu");
    group.setAttribute("transform",
        `translate(${i.x} ${i.y})`
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
    plate.appendChild(group);
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
    plate.appendChild(group);
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
        //slightly round the rectangles with rx
        body.setAttribute("rx", 1)
        body.setAttribute("x", x)
        body.setAttribute("y", y)
        body.setAttribute("fill", `rgba(20, ${green}, ${blue}, 0.8)`)
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

    //centering the noodle to appear in center
    const x = (126 + 1196) / 2
    const y = (126 + 1196) / 2
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
    // path exported from my own Affinity Design Illustration
    body.setAttribute("d", "M 201,516C201,516 188.767,185.614 502.5,210C502.5,210 1050.29,254.409 814,592C762.073,666.19 126.376,1066.05 348,156C348,156 366.357,54.057 476,80C476,80 1196.5,154.333 579,754C527.719,803.8 167.499,951.079 281,462C281,462 361.575,177.697 579,344C579,344 766.493,540.34 785,675 Z")
    body.setAttribute("fill", "none")
    body.setAttribute("stroke", "yellow")
    body.setAttribute("stroke-width", 20)

    group.appendChild(body);
    plate.appendChild(group);
    return group;

}


// ANIMATION FUNCTIONS

function stamp(element) {

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
            ease: "power2.out"
        })
        .to(element, {
            scale: 1,
            duration: 0.28,
            ease: "back.out(2)"
        })
}

function spin(element) {
    gsap.timeline()
        .to(element, {
            duration: 0.28,
            scaleX: 0,
            transformOrigin: "50% 50%",
            repeat: 1,
            yoyo: true,
            // ease: "power2.out"
        })
}

function placeholder(element) {
    return;
}

function sprinkle(element) {

    const dashes = [element.children];

    gsap.set(dashes, {
        y: -50,
        scale: 0.2,
        opacity: 0
    });

    gsap.to(dashes, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.32,
        stagger: {
            each: 0.025,
            from: "random"
        },
        ease: "back.out(2)",
        rotation: "+=" + random(-180, 180),
    })
}

// UTIL FUNCTIONS

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