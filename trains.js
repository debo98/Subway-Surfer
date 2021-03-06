/// <reference path="webgl.d.ts" />

let Trains = class {
	constructor(gl, pos) {
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

		this.length = 5;
		this.width = 2;
		this.thickness = 2.5;
		this.positions = [
			// Front face
			-this.width, -this.thickness, -this.length,
			this.width, -this.thickness, -this.length,
			this.width, this.thickness, -this.length,
			-this.width, this.thickness, -this.length,
			//Back Face
			-this.width, -this.thickness, this.length,
			this.width, -this.thickness, this.length,
			this.width, this.thickness, this.length,
			-this.width, this.thickness, this.length,
			//Top Face
			-this.width, this.thickness, this.length,
			this.width, this.thickness, this.length,
			this.width, this.thickness, -this.length,
			-this.width, this.thickness, -this.length,
			//Bottom Face
			-this.width, -this.thickness, this.length,
			this.width, -this.thickness, this.length,
			this.width, -this.thickness, -this.length,
			-this.width, -this.thickness, -this.length,
			//Left Face
			-this.width, -this.thickness, this.length,
			-this.width, this.thickness, this.length,
			-this.width, this.thickness, -this.length,
			-this.width, -this.thickness, -this.length,
			//Right Face
			this.width, -this.thickness, this.length,
			this.width, this.thickness, this.length,
			this.width, this.thickness, -this.length,
			this.width, -this.thickness, -this.length,
		];

		this.rotation = 0;

		this.pos = pos;

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
		
		this.textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

		const textureCoordinates = [
			// Front
			1.0,  1.0,
			0.0,  1.0,
			0.0,  0.0,
			1.0,  0.0,
			// Back
			1.0,  1.0,
			0.0,  1.0,
			0.0,  0.0,
			1.0,  0.0,
			// Top
			1.0,  1.0,
			0.0,  1.0,
			0.0,  0.0,
			1.0,  0.0,
			// Bottom
			1.0,  1.0,
			0.0,  1.0,
			0.0,  0.0,
			1.0,  0.0,
			// Right
			1.0,  1.0,
			0.0,  1.0,
			0.0,  0.0,
			1.0,  0.0,
			// Left
			1.0,  1.0,
			0.0,  1.0,
			0.0,  0.0,
			1.0,  0.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
		            gl.STATIC_DRAW);

		// Build the element array buffer; this specifies the indices
		// into the vertex arrays for each face's vertices.

		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.

		const indices = [
			0, 1, 2,    0, 2, 3, // front
			4, 5, 6,    4, 6, 7,
			8, 9, 10,   8, 10, 11,
			12, 13, 14, 12, 14, 15,
			16, 17, 18, 16, 18, 19,
			20, 21, 22, 20, 22, 23, 
		];

		// Now send the element array to GL

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(indices), gl.STATIC_DRAW);

		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

		const vertexNormals = [
			// Front
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,

			// Back
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,

			// Top
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,

			// Bottom
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			// Right
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,

			// Left
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
		            gl.STATIC_DRAW);


		this.buffer = {
			position: this.positionBuffer,
			normal: this.normalBuffer,
   			textureCoord: this.textureCoordBuffer,
			indices: indexBuffer,
		}

		this.vertex_count = 36;

	}

	draw(gl, projectionMatrix, programInfo, deltaTime) {
		const modelViewMatrix = mat4.create();
		mat4.translate(
			modelViewMatrix,
			modelViewMatrix,
			this.pos
		);
		
		//this.rotation += Math.PI / (((Math.random()) % 100) + 50);

		mat4.rotate(modelViewMatrix,
			modelViewMatrix,
			this.rotation,
			[1, 1, 1]);

		const normalMatrix = mat4.create();
		mat4.invert(normalMatrix, modelViewMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition);
		}

		// Tell WebGL how to pull out the normals from
		// the normal buffer into the vertexNormal attribute.
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.normal);
			gl.vertexAttribPointer(
			    programInfo.attribLocations.vertexNormal,
			    numComponents,
			    type,
			    normalize,
			    stride,
			    offset);
			gl.enableVertexAttribArray(
			    programInfo.attribLocations.vertexNormal);
		}

		// Tell WebGL how to pull out the colors from the color buffer
		// into the vertexColor attribute.
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
			gl.vertexAttribPointer(
				programInfo.attribLocations.textureCoord,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			gl.enableVertexAttribArray(
				programInfo.attribLocations.textureCoord);
		}

		// Tell WebGL which indices to use to index the vertices
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

		// Tell WebGL to use our program when drawing

		gl.useProgram(programInfo.program);

		// Set the shader uniforms

		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.normalMatrix,
			false,
			normalMatrix);
		// Tell WebGL we want to affect texture unit 0
		gl.activeTexture(gl.TEXTURE0);

		// Bind the texture to texture unit 0
		gl.bindTexture(gl.TEXTURE_2D, train_texture);

		// Tell the shader we bound the texture to texture unit 0
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

		{
			const vertexCount = this.vertex_count;
			const type = gl.UNSIGNED_SHORT;
			const offset = 0;
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		}

	}
};