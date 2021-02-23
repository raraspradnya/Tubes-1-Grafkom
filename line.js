
var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "",
  "void main()",
  "{",
  "  fragColor = vertColor;",
  "  gl_Position = vec4(vertPosition, 0.0, 1.0);",
  "}",
].join("\n");

var fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

var length = 1;
var canvas_width = 0;
var canvas_height = 0;
var u_xformMatrix;
var vertex_buffer;
var xformMatrix;
var shaderProgram;
var Index_Buffer;


window.onload = function init() {
  draw(1);
  document.getElementById("length").addEventListener("change", function() {
    console.log(document.getElementById("length").value);
    length = document.getElementById("length").value;
    draw(length);
  });
}

function draw(length){
  /*============ Creating a canvas =================*/
  var canvas = document.getElementById('surface');
  canvas_height = canvas.height;
  canvas_width = canvas.width;

  gl = canvas.getContext('experimental-webgl');

  // Set the view port
  gl.viewport(0,0,canvas_width,canvas_height);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  /*========== Defining and storing the geometry =========*/

  var add = length * 0.1;
  var minus = -0.1 - add;
  var plus = 0.1 + add;

  var vertices = [
    minus,minus,0,
    plus,plus,0
 ]

  // Create an empty buffer object to store vertex buffer
  vertex_buffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  /*====================== Shaders =======================*/

  // Vertex shader source code
  var vertCode =
    'attribute vec3 coordinates;' +
    'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
    '}';

  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  // Fragment shader source code
  var fragCode =
    'void main(void) {' +
        ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
    '}';

  // Create fragment shader object 
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);

  // Compile the fragmentt shader
  gl.compileShader(fragShader);

  // Create a shader program object to
  // store the combined shader program
  shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both the programs
  gl.linkProgram(shaderProgram);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  /* ======= Associating shaders to buffer objects =======*/

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Bind index buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 

  // Get the attribute location
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coord);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  // Clear the color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set the view port
  gl.viewport(0,0,canvas.width,canvas.height);

  // Draw the triangle
  gl.drawArrays(gl.LINES, 0, 2);
}


