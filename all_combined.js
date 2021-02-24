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


var square_vertices = [];
var line_vertices = [];
var polygon_vertices = [];
var lines_square;
var arrPoly;
var arrLines;
var length = 1;
var size = 1;
var canvas_width = 0;
var canvas_height = 0;
var vertices;

var vertex_buffer;
var shaderProgram;
var Index_Buffer;

var tx = 0;
var ty = 0;

window.onload = function init() {
  document.getElementById("length").addEventListener("change", function () {
    console.log(document.getElementById("length").value);
    length = document.getElementById("length").value;
    draw_line(length, vertices, tx, ty);
  });

  document.getElementById("tx-line").addEventListener("change", function () {
    tx = document.getElementById("tx-line").value;
    draw_line(length, vertices, tx, ty);
  });

  document.getElementById("ty-line").addEventListener("change", function () {
    ty = document.getElementById("ty-line").value;
    draw_line(length, vertices, tx, ty);
  });

  document.getElementById("size").addEventListener("change", function () {
    console.log(document.getElementById("size").value);
    size = document.getElementById("size").value;
    draw_square(size, vertices, tx, ty);
  });

  document.getElementById("tx-square").addEventListener("change", function () {
    tx = document.getElementById("tx-square").value;
    draw_square(size, vertices, tx, ty);
  });

  document.getElementById("ty-square").addEventListener("change", function () {
    ty = document.getElementById("ty-square").value;
    draw_square(size, vertices, ty);
  });

  document.getElementById("color").addEventListener("change", function () {
    color = document.getElementById("color").value;
    console.log(color);
    rgb_array = hexToRgbA(color);
    draw_polygon(rgb_array, vertices);
  });

  document.getElementById('inputfile_line').addEventListener('change', function() { 
    var file = this.files[0];
  
    var reader = new FileReader();
    reader.onload = function(progressEvent){
  
      // By lines
      arrLines = this.result.split('\n');
      for(var line = 0; line < 2; line++){
        var j = 0;
        var teks = '';
        while(j < arrLines[line].length){
          var char = arrLines[line][j];
          if (char !='\,'){
            teks += arrLines[line][j];
          }else{
            line_vertices.push(parseFloat(teks));
            teks = '';
          }
          j++;
        }
      }
      line_vertices.push(0);
      console.log(line_vertices);
      vertices = line_vertices;
      draw_line(1, line_vertices, 0, 0);
    };
    reader.readAsText(file);
  });

  document.getElementById('inputfile_polygon').addEventListener('change', function() { 
    var file = this.files[0];
  
    var reader = new FileReader();
    reader.onload = function(progressEvent){
  
      // By lines
      arrPoly = this.result.split('\n');
      for(var line = 0; line < arrPoly.length; line++){
        var j = 0;
        var teks = '';
        while(j < arrPoly[line].length){
          var char = arrPoly[line][j];
          if (char !='\,'){
            teks += arrPoly[line][j];
          }else{
            polygon_vertices.push(parseFloat(teks));
            teks = '';
          }
          j++;
        }
      }
      polygon_vertices.push(0);
      console.log(polygon_vertices);
      vertices = polygon_vertices;
      draw_polygon(1, polygon_vertices);
    };
    reader.readAsText(file);
  });
  
  document.getElementById('inputfile_square').addEventListener('change', function() { 
    var file = this.files[0];
  
    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      // console.log(this.result);
  
      // By lines
      lines_square = this.result.split('\n');
      for(var line = 0; line < 4; line++){
        // console.log(lines_square[line]);
        var j = 0;
        var teks = '';
        while(j < lines_square[line].length){
          var char = lines_square[line][j];
          if (char !='\,'){
            teks += lines_square[line][j];
          }else{
            square_vertices.push(parseFloat(teks));
            teks = '';
          }
          j++;
        }
      }
      square_vertices.push(0);
      console.log(square_vertices);
      vertices = square_vertices;
      draw_square(1, square_vertices, 0,0);
    };
    reader.readAsText(file);
  });
};

function initLine() {
  var add = length * 0.1;
  var minus = -0.1 - add;
  var plus = 0.1 + add;

  vertices = [minus, minus, 0, plus, plus, 0];
  draw_line(1, vertices, 0, 0);
}

function initSquare(){
  var minus = -0.1;
  var plus = 0.1;

  vertices =  [
    minus, plus, 0.0,
    minus, minus, 0.0,
    plus, minus,0.0,
    plus, plus, 0.0 
  ];
  draw_square(1, vertices, 0,0);
};

function hexToRgbA(hex) {
  var c;
  var result;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (result = {
      r: ((c >> 16) & 255) / 256,
      g: ((c >> 8) & 255) / 256,
      b: (c & 255) / 256,
      a: 1,
    });
  }
  throw new Error("Bad Hex");
}

function initPolygon() {
  rgb_array = hexToRgbA("#000000");
  var x = 0; //x coordinate for the center of the hexagon
  var y = 0; //y coordinate for the center of the hexagon
  var r = 0.5; //radius of the circle upon which the vertices of the hexagon lie.
  var q = Math.sqrt(Math.pow(r, 2) - Math.pow(r / 2, 2)); //y coordinate of the points that are above and below center point
  var xCoord = new Array(8);
  var yCoord = new Array(8);
  xCoord[0] = x;
  yCoord[0] = y;
  xCoord[1] = x + r;
  yCoord[1] = y;
  xCoord[2] = x + r / 2;
  yCoord[2] = y + q;
  xCoord[3] = x - r / 2;
  yCoord[3] = y + q;
  xCoord[4] = x - r;
  yCoord[4] = y;
  xCoord[5] = x - r / 2;
  yCoord[5] = y - q;
  xCoord[6] = x + r / 2;
  yCoord[6] = y - q;
  xCoord[7] = x + r;
  yCoord[7] = y;

  var polygon = []; // Initialize Array

  for (var i = 0; i < xCoord.length; ++i) {
    polygon.push(xCoord[i]);
    polygon.push(yCoord[i]);
    polygon.push(0);
  }
  draw_polygon(rgb_array,polygon);
}


function draw_line(size, v, tx, ty) {
  /*============ Creating a canvas =================*/
  var canvas = document.getElementById("surface");
  canvas_height = canvas.height;
  canvas_width = canvas.width;

  gl = canvas.getContext("experimental-webgl");

  // Set the view port
  gl.viewport(0, 0, canvas_width, canvas_height);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  /*========== Defining and storing the geometry =========*/

  vertices = v;

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
    "attribute vec3 coordinates;" +
    "uniform vec4 translation;" +
    'uniform mat4 u_xformMatrix;' +
    "void main(void) {" +
    " gl_Position = vec4(coordinates, 1.0) * u_xformMatrix + translation;" +
    "}";

  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  // Fragment shader source code
  var fragCode =
    "void main(void) {" + " gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);" + "}";

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

  var Xp = (vertices[0] + vertices[3])/2, Yp = (vertices[1] + vertices[4])/2

  var Sx = size, Sy = size, Sz = size;
  var xformMatrix = new Float32Array([
    Sx,   0.0,  0.0,  Xp - Sx*Xp,
    0.0,  Sy,   0.0,  Yp - Sy*Yp,
    0.0,  0.0,  1,   0.0,
    0.0,  0.0,  0.0,  1.0  
  ]);

  var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

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

  var translation = gl.getUniformLocation(shaderProgram, "translation");
  gl.uniform4f(translation, tx, ty, 0.0, 0.0);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  // Clear the color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set the view port
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Draw the triangle
  gl.drawArrays(gl.LINES, 0, 2);
}

function draw_square(size, v, tx, ty) {
  /*============ Creating a canvas =================*/
  var canvas = document.getElementById("surface");
  canvas_height = canvas.height;
  canvas_width = canvas.width;

  gl = canvas.getContext("experimental-webgl");

  // Set the view port
  gl.viewport(0, 0, canvas_width, canvas_height);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  /*========== Defining and storing the geometry =========*/

  vertices = v;
  indices = [3,2,1,3,1,0];

  // Create an empty buffer object to store vertex buffer
  vertex_buffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Create an empty buffer object to store Index buffer
  Index_Buffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  // Unbind the buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  /*====================== Shaders =======================*/

  // Vertex shader source code
  var vertCode =
    "attribute vec3 coordinates;" +
    "uniform vec4 translation;" +
    'uniform mat4 u_xformMatrix;' +
    "void main(void) {" +
    " gl_Position = vec4(coordinates, 1.0) * u_xformMatrix + translation;" +
    "}";

  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  // Fragment shader source code
  var fragCode =
    "void main(void) {" + " gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);" + "}";

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

  console.log(vertices)

  var Xp = (vertices[0] + vertices[3] + vertices[6] + vertices[9])/4, Yp = (vertices[1] + vertices[4] + vertices[7] + vertices[10])/10

  var Sx = size, Sy = size, Sz = size;
  var xformMatrix = new Float32Array([
    Sx,   0.0,  0.0,  Xp - Sx*Xp,
    0.0,  Sy,   0.0,  Yp - Sy*Yp,
    0.0,  0.0,  Sz,   0.0,
    0.0,  0.0,  0.0,  1.0  
  ]);

  var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

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

  var translation = gl.getUniformLocation(shaderProgram, "translation");
  gl.uniform4f(translation, tx, ty, 0.0, 0.0);

  // Draw the triangle
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function draw_polygon(rgb_array, v) {
  console.log(rgb_array);
  /*============ Creating a canvas =================*/
  var canvas = document.getElementById("surface");
  canvas_height = canvas.height;
  canvas_width = canvas.width;

  gl = canvas.getContext("experimental-webgl");

  // Set the view port
  gl.viewport(0, 0, canvas_width, canvas_height);

  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  /*========== Defining and storing the geometry =========*/

  vertices = v;

  // Create an empty buffer object to store vertex buffer
  vertex_buffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // // Create an empty buffer object to store Index buffer
  // Index_Buffer = gl.createBuffer();

  // // Bind appropriate array buffer to it
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

  // // Pass the vertex data to the buffer
  // gl.bufferData(
  //   gl.ELEMENT_ARRAY_BUFFER,
  //   new Uint16Array(indices),
  //   gl.STATIC_DRAW
  // );

  // // Unbind the buffer
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  /*====================== Shaders =======================*/

  // Vertex shader source code
  var vertCode =
    "attribute vec3 coordinates;" +
    "void main(void) {" +
    " gl_Position = vec4(coordinates, 1.0);" +
    "}";

  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  // Prepare color
  var color =
    "vec4(" +
    rgb_array.r +
    "," +
    rgb_array.g +
    "," +
    rgb_array.b +
    "," +
    rgb_array.a +
    ");";

  // Fragment shader source code
  var fragCode = "void main(void) {" + "gl_FragColor = " + color + "}";

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

  // // Bind index buffer object
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

  // Get the attribute location
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coord);

  // Draw the triangle
  // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length/3);
}
