var vertexShaderSource = `
    precision mediump float;

    attribute vec2 vertex_position;
    attribute vec3 vertex_color;
    attribute float is_point;
    
    varying vec3 fragment_color;
    varying float point;

    void main () {
        point = is_point;
        fragment_color = vertex_color;
        gl_Position = vec4(vertex_position, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`;

var fragmentShaderSource = `
    precision mediump float;

    varying vec3 fragment_color;
    varying float point;

    void main () {
        if (point == 0.0) {
            gl_FragColor = vec4(fragment_color, 1.0);
        } else {
            float d = distance(gl_PointCoord, vec2(0.5, 0.5));
            if(d < 0.5) {
                gl_FragColor = vec4(fragment_color, 1.0);
            } else { discard; }
        }
    }
`;

/**
 * Global variables
 */
var gl, program, canvas;
var points = [];
var triangles = [];


function onmousedown(event) {
    var x = event.clientX;
    var y = event.clientY;

    var midX = canvas.width/2;
    var midY = canvas.height/2;
    
    var rect = event.target.getBoundingClientRect();

    x = ((x - rect.left) - midX) / midX;
    y = (midY - (y - rect.top)) / midY;

    console.log(x + " " + y);

    points = points.concat([[
        // X, Y         R, G, B
        [x, y,         0.1, 0.1, 0.1],
    ]])

    console.log(points)

    draw();
}

/**
 * Initialize opengl environtment
 */
function freedrawinit() {
    canvas = document.getElementById("freedraw_surface");
    gl = canvas.getContext("webgl");

    canvas.addEventListener('mousedown', event => onmousedown(event));

    // Only continue if WebGL is available and working
    if (gl == null) {
        alert("Your browser don't support HTML5");
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
}

function refresh() {
    // Set clear color to black, fully opaque
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function draw() {
    refresh();

    points.forEach(elmt => {
        drawPoints(elmt);
    });

    triangles.forEach(elmt => {
        drawTriangle(elmt);
    });
}

/**
 * Draw Points
 * @param {*} vertices 
 */
function drawPoints(vertt) {
    vertices = [...vertt];

    vertices.forEach((element, index, arr) => {
        arr[index] = [1.0].concat(element);
    })

    vertices = [].concat(...vertices);

    // console.log(vertices)

    var gpuBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    gl.vertexAttribPointer(
        gl.getAttribLocation(program, 'is_point'), // Attribute Location
        1, // Number of elements per attribute
        gl.FLOAT, // Types of elements
        false, // Is normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.vertexAttribPointer(
        gl.getAttribLocation(program, 'vertex_position'), // Attribute Location
        2, // Number of elements per attribute
        gl.FLOAT, // Types of elements
        false, // Is normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        1 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.vertexAttribPointer(
        gl.getAttribLocation(program, 'vertex_color'), // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // Types of elements
        false, // Is normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'is_point'));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'vertex_position'));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'vertex_color'));
    
    /**
     * Main render loop
     */
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, 1);
}

/**
 * Draw Triangles
 * @param {*} vertices 
 */
function drawTriangle(vertt) {
    vertices = [...vertt];

    vertices.forEach((element, index, arr) => {
        arr[index] = [0].concat(element);
    })

    vertices = [].concat(...vertices);

    var gpuBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    gl.vertexAttribPointer(
        gl.getAttribLocation(program, 'is_point'), // Attribute Location
        1, // Number of elements per attribute
        gl.FLOAT, // Types of elements
        false, // Is normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.vertexAttribPointer(
        gl.getAttribLocation(program, 'vertex_position'), // Attribute Location
        2, // Number of elements per attribute
        gl.FLOAT, // Types of elements
        false, // Is normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        1 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.vertexAttribPointer(
        gl.getAttribLocation(program, 'vertex_color'), // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // Types of elements
        false, // Is normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'is_point'));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'vertex_position'));
    gl.enableVertexAttribArray(gl.getAttribLocation(program, 'vertex_color'));
    
    /**
     * Main render loop
     */
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function freedrawmain() {
    freedrawinit();

    // triangles = [[
    //     // X, Y             R, G, B
    //     [-0.5, 0.7,         1.0, 0.0, 0.0],
    //     [-0.9, -0.5,        0.0, 1.0, 0.0],
    //     [0, -0.5,           0.0, 0.0, 1.0]
    // ], [
    //     [0, 0.7,            1.0, 0.0, 0.0],
    //     [-0.4, -0.5,        0.0, 1.0, 0.0],
    //     [0.5, -0.5,         0.0, 0.0, 1.0]
    // ]];

    // points = [[
    //     // X, Y         R, G, B
    //     [-0.5, 0.9,         1.0, 0.0, 1.0],
    // ], [
    //     [-0.4, 0.9,         1.0, 0.0, 0.0],
    // ]];
    
    draw();
}
