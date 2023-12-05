import * as THREE from 'three';    // this is loading in three.js 
import * as tf from '@tensorflow/tfjs';   // loading in tensorflow 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//_____________________SETUP_RENDERER______________________// 
const canvas = document.querySelector('.webgl');      // Select the canvas element from the index.html
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
// this is from final_ægte
//renderer.setPixelRatio(window.devicePixelRatio);
//renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement); 
//window.addEventListener('resize', onWindowResize, false); 
//camera.position.set(500,500,500); 
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// _____________________INSTANTIALIZE OBJECTS______________________// 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set( 300, 100, 500 );
controls.update();
//camera.position.z = 500;
//camera.position.set(-250,-50,-250);

// adding two scenes to be able to shift between them
const originalScene = new THREE.Scene();
const queerScene = new THREE.Scene(); 
const myTextureLoader = new THREE.TextureLoader();
originalScene.add(camera);
queerScene.add(camera);

// canvas.addEventListener('mousemove', getMouse, false);    // hvad skal jeg kalde den her på? renderer=  

// dette gør at vi ikke flytter udenfor skybox
controls.minDistance = 10;
controls.maxDistance = 1300;

//_______________________ AXES HELPER________________________// 
const axesHelper = new THREE.AxesHelper(100);
originalScene.add(axesHelper);
queerScene.add(axesHelper);

//________ LOAD IN LATENT VECTORS ORIGINAL DATA_________//
async function getOGVectors(){
  const response = await fetch("/latent_vectors_aegte.json");      // get the specific json file  
  const fetchedData = await response.json();        // tells that we are fetching json 
  console.log('data in',fetchedData);        // check that the data is right 
  return fetchedData;
};

let originalData;     // declare the data variable in outer scope, needs to be let as it will alter when we put data into it

// call fetch function and assign data 
getOGVectors()
  .then(fetchedData => {
    originalData = fetchedData; // Store the fetched data in the outer variable
    console.log('hello',fetchedData); // check that the data is right 
    OGData(originalData);      // call here ecause getvectors is async
  });

// ______________LOAD IN QUEER VECTORS______________// 

async function getQueerVectors() {
  const queerResponse = await fetch('/interpolated_latent_vectors.json');
  const fetchedQueerData = await queerResponse.json();
  console.log('data here',fetchedQueerData);
  return fetchedQueerData;
}

let queerData;

// call new fetch function and assign data
getQueerVectors()
  .then(async fetchedQueerData => {
   queerData = fetchedQueerData; // Store the fetched data in the outer variable
    console.log('hello queers',fetchedQueerData); // check that the data is right 
    interpolatedData(queerData);      // call here ecause getvectors is async
  });

//___________CREATE_THREE_JS_OBJECTS_FOR_VECTORS___________// 
 //Function to load data into Three.js using the fetched 'data'
function OGData(data1) {
  const object1 = new THREE.Object3D();      // create empty object 
data1.forEach(vector1 => {     // create new object for each vector in /the data variable
    const [x, y, z] = vector1;
    //const geometry = new THREE.CapsuleGeometry(5, 15, 32, 20);
    const geometry1 = new THREE.SphereGeometry(5,32,32);
    const points1 = [];
    for ( let i = 0; i < 10; i ++ ) {
      points1.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5 + 5, ( i - 5 ) * 2 ) );
  }
    //const geometry = new THREE.LatheGeometry( points );
    const material1 = new THREE.MeshBasicMaterial({ color: '#00e600' });
    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(x, y, z);      // place the vectors / data points in the scene in relation to each other
    object1.add(mesh1);
  });
  originalScene.add(object1); // Add the object containing spheres to the scene
  console.log('hello queeres, im also here');
}

// function to load the interpolated data intro Three.js using the fetched queer data 
function interpolatedData(data2){
  const object2 = new THREE.Object3D();
  data2.forEach(vector2 => {
    const [h, m, k] = vector2;
    const geometry2 = new THREE.SphereGeometry(5,32,32);
    const points2 = [];
    for (let j = 0; j < 10; j ++){
      points2.push(new THREE.Vector2(Math.sin(j * 0.2) * 5 + 5, (j - 5) * 2));
    }
    const material2 = new THREE.MeshBasicMaterial({ color: '#ff1aff' });
    const mesh2 = new THREE.Mesh(geometry2,material2);
    mesh2.position.set(h, m, k);
    object2.add(mesh2);
  });
  queerScene.add(object2);        // added to the same scene
  console.log('helloqueers, im here!');
} ;

// this will use the points to create meshes: CAN BE ADDED LATER IF TIME!! 
//const points2 = [];
  //  for (let j = 0; j < 10; j ++){
    //  points2.push(new THREE.Vector2(Math.sin(j * 0.2) * 5 + 5, (j - 5) * 2));
    //}

    //const shape = new THREE.Shape(points2);
    //const geometry2 = new THREE.ShapeGeometry(shape); // Create geometry from the shape

//_________________ADD_USER_INPUT_________________// this was created with the help of chatgpt 


let sceneState = 'originalScene';     // initialize the scene to one state 

// Double-click event listener
function toggleScenes() {
  if (sceneState === 'queerScene') {
    // if double click and originalscene then go to queerscene
    originalScene.visible = false;     
    queerScene.visible = true;
    sceneState = 'queerScene';
    
  } else {
    // if double click and queer scene then go to original scene
    queerScene.visible = false;    
    originalScene.visible = true;
    sceneState = 'originalScene';
    console.log('togelelle');
  };
};
// Add event listener for double-click
document.addEventListener('dblclick', toggleScenes);

// need to use hirarchical positioning here in order to move the latent space, when something moves 


//__________________LIGHT_____________________// 
//const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const ambientlight = new THREE.AmbientLight( 0x404040 ); // soft white lighto
originalScene.add(ambientlight);
queerScene.add(ambientlight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
originalScene.add(directionalLight);
queerScene.add(ambientlight);

//_______ANIMATE______// 
function animate() {
  requestAnimationFrame(animate);
  // Update objects, camera, or any other animations here
  renderer.render(originalScene, camera);
  renderer.render(queerScene, camera)
}

animate();



//__________ can be thrown out???? _____________// 

//const loader = new THREE.ObjectLoader();     // create object loader to load in json 

//const latent_vectors = []   ;    // hold all the data 

// function loads in the json file w latent vectors

//___________________________ CREATE SPHERE _________________________ // 
//const geometry = new THREE.SphereGeometry(1,32,32);
//const material = new THREE.MeshStandardMaterial({
//  color: '#33cc33'
//});
//const spheres  = [];             // this holds all the representations of the data  




//__OLD FUNCTIONS TO LOAD IN QUEER DATA __
/*async function getQueerVectors() {
  const queerResponse = await fetch('/interpolated_latent_vectors.json');
  const fetchedQueerData = await queerResponse.json();
  console.log(fetchedQueerData);
  return fetchedQueerData;
}

let queerData;

// call new fetch function and assign data
getQueerVectors()
  .then(async fetchedQueerData => {
   queerData = fetchedQueerData; // Store the fetched data in the outer variable
    console.log('hello queers',fetchedQueerData); // check that the data is right 
    interpolatedData(queerData);      // call here ecause getvectors is async
  });*/


  /*
function mouseDoubleClick(event){
  if (event.detail ===2) {     // if mouse doubleclicked 
    sceneState = (sceneState === 'original') ? 'queer': 'original';
    updateScene();
  }}

  document.addEventListener('dblclick', mouseDoubleClick);  // FUNCTION CALL IN THE END HERE!!! 

function updateScene(){
  clearScene();      //remove the meshes in the scene
  if (sceneState === 'original'){
    OGData(originalData);
  } else if (sceneState === ' queer'){
    interpolatedData(queerData);  
  }
}

function clearScene(){
    // Remove all objects from the scene
    scene.traverse(object =>) {
      if (object instanceof THREE.Mesh) {
        scene.remove(object);
      }
    }}


updateScene();*/