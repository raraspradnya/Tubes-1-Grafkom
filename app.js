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

function InitDemo() {
  console.log("Hello from WebGL server");

  //
  // Init the canvas (WebGL)
  //
  var canvas = document.getElementById("surface");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL is not support by your browser");
    gl = canvas.getContext("experimental-webgl");
    alert("Your browser does not support WebGL");
  }

  // Clear the screen canvas with the specifies color
  // it's RGB + Alfa
  gl.clearColor(0.2, 0.68, 0.84, 1.0);

  // Clear the buffer to preset value
  // clear the color buffer using color_buffer_bit
  // clear the depth buffer using color_buffer_bit
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //
  // Init the shader
  //
  // Create the WebGL shader that can be configured later
  // The parameter is whether vertex_shader or fragment_shader
  // Use the VERTEX_SHADER to define the vertex shader
  // Use the FRAGMENT_SHADER to define the fragment shader
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling the vertex shader",
      gl.getShaderInfoLog(vertexShader)
    );
    return;
  }

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderText);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling the vertex shader",
      gl.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  //
  // Create the program and link it to WebGL API
  //
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking program", gl.getProgramInfoLog(program));
    return;
  }

  //
  // Create buffer
  //
  var triangleVertices = 
  [ // X, Y
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ];
  var triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  var vertexPosition = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    vertexPosition,
    2,
    gl.FLOAT,
    false,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0
  );

  gl.enableVertexAttribArray(vertexPosition);

  //
  // Main render loop
  //
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / 2);
}
