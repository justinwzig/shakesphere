// Adapted from  https://github.com/Lorti/webgl-3d-model-viewer-using-three.js/blob/master/index.html

if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}
var container;
var camera, controls, scene, renderer, box;
var lighting, ambient, keyLight, fillLight, backLight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
animate();
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    /* Camera */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 3;
    /* Scene */
    scene = new THREE.Scene();
    lighting = true;
    ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);
    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);
    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);
    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();
    /* Model */
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('assets/');
    mtlLoader.setPath('assets/');   
    mtlLoader.load('shakesphere.mtl', function (materials) {
        materials.preload();
        console.log(materials);
        //materials.materials.default.map.magFilter = THREE.NearestFilter;
        //materials.materials.default.map.minFilter = THREE.LinearFilter;
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('assets/');
        objLoader.load('shakesphere.obj', function (object) {
            box = new THREE.Box3().setFromObject(object);
            console.log(box.min, box.max, box.getSize());
            object.translateY(-box.max.y/4);
            object.translateZ(-box.max.y/2);
            object.scale.set(0.5,0.5,0.5)
           
            scene.add(object);
        });
    });
    /* Renderer */
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
    container.appendChild(renderer.domElement);
    /* Controls */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, -8.333286146423234/ 2);
    console.log(controls.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    /* Events */
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyboardEvent, false);
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function onKeyboardEvent(e) { 
    if (e.code === 'KeyL') {
        lighting = !lighting;
        if (lighting) {
            ambient.intensity = 1.25;
            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);
        } else {
            ambient.intensity = 1.0;
            scene.remove(keyLight)  ;
            scene.remove(fillLight);
            scene.remove(backLight);
        }
    }
}
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}
function render() {
    renderer.render(scene, camera);
}