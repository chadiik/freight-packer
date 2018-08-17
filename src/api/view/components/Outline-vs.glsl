
uniform float offset;
varying vec3 vViewPosition;

void main( void ) {
    
    float amount = offset;
    vec3 vertexPosition = position + normal * offset;
	vec4 modelPosition = modelMatrix * vec4( position, 1. );
	//vNormal = normalize( normalMatrix * normal );

	gl_Position = projectionMatrix * viewMatrix * modelPosition;
}