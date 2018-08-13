varying vec3 vNormal;
varying vec4 vPosition;

void main() {
    vNormal   = normal;
    vPosition = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position = vPosition;
}