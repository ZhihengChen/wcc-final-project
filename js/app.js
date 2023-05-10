import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";
import gsap from "gsap";

import matcap from './assets/matcap01.png'
import matcap1 from './assets/matcap02.png'
import model from './assets/tv.gltf';
import bottle from './assets/bottle.gltf';
import lid from './assets/lid.gltf';
import pill1 from './assets/pill1.gltf';
import pill2 from './assets/pill2.gltf';
import pill3 from './assets/pill3.gltf';
import pill4 from './assets/pill4.gltf';
import pill5 from './assets/pill5.gltf';
import pill6 from './assets/pill6.gltf';
import pill7 from './assets/pill7.gltf';
import pill8 from './assets/pill8.gltf';
import speaker01 from './assets/speaker01.gltf';
import speaker02 from './assets/speaker02.gltf';


export default class Sketch{
    constructor(options){
        this.scene = new THREE.Scene();

        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height =this.container.offsetHeight;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );

        this.camera.position.set(0, 0.2, 1.5);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.spotLight = new THREE.SpotLight(0xFFFFFF);
        this.scene.add(this.spotLight);
        this.spotLight.position.set(-50, 50, 50);
        this.spotLight.angle = 0.2;

        this.isPlaying = true;

        this.addObjects();
        this.resize();
        this.render();
        this.setupResize();
        this.mouseEvents();
        this.settings();

    }

mouseEvents(){
    this.mouse = new THREE.Vector2();
    document.addEventListener('mousemove',(e)=>{
    this.mouse.x = e.pageX / this.width - 0.5;
    this.mouse.y = - e.pageY / this.height + 0.5;

      })
    }

settings(){
    let that = this;
    this.settings = {progress: 0};
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 0.2, 0.001);
    }

setupResize(){
    window.addEventListener("resize", this.resize.bind(this));
    }

resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.imageAspect = 1;
    let a1; let a2;
    if(this.height/this.width>this.imageAspect){
        a1 = (this.width / this.height) * this.imageAspect;
        a2 = 1;
    } else{
        a1 = 1;
        a2 = (this.height / this.width) / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
    }

addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
        extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 0 },
            numbb:{  value: 0 },
            progress: { value: 0 },
            mouse: { value: new THREE.Vector2(0, 0) },
            matcap: { value: new THREE.TextureLoader().load(matcap) },
            matcap1: { value: new THREE.TextureLoader().load(matcap1) },
            resolution: { value: new THREE.Vector4() },
        },

        vertexShader: vertex,
        fragmentShader: fragment
    });

    this.geometry = new THREE.PlaneGeometry(1.5, 1.1, 1, 1);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
    this.plane.position.set(0, 0.05, -0.05);

    this.groundGeometry = new THREE.PlaneGeometry(20, 20);
    this.groundMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

	this.groundMirror = new Reflector( this.groundGeometry , {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio / 5,
		textureHeight: window.innerHeight * window.devicePixelRatio / 5,
		color: 0xb5b5b5
	} );

	this.groundMirror.position.y = -0.71;
	this.groundMirror.rotateX( - Math.PI / 2 );
	this.scene.add( this.groundMirror );

    this.ground = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
    this.scene.add(this.ground);
    this.ground.rotation.x = -0.5 * Math.PI;
    this.ground.position.set(0, -0.65, -2.5);

 
    this.loader = new GLTFLoader();
    this.loader.load(model, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                o.geometry.center();
                o.scale.set(0.04, 0.04, 0.04)
                o.position.set(0,-0.02, -1.53)
                // o.material = this.material;
            }
        })
    })    
    this.loader.load(speaker01, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(1.3, 1.3, 1.3)
                o.position.set(-1.1,0, 0.71)
            }
        })
    }) 
    this.loader.load(speaker02, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(1.3, 1.3, 1.3)
                o.position.set(1.59,0.53, 0.71)
            }
        })
    }) 
    this.loader.load(bottle, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.01, 0.01, 0.01)
                o.position.set(-0.6, 0.74, -0.5)
                // o.material = this.material;
            }
        })

    })
    this.loader.load(lid, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.01, 0.01, 0.01)
                o.position.set(-0.3, 0.91, -0.45)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill1, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(0, 0.7, -0.05)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill2, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(0, 0.69, -0.25)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill3, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(-0.3, 0.7, -0.45)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill4, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(0, 0.65, -0.1)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill5, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(-0.3, 0.7, 0.25)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill6, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(-0.1, 0.7, 0.15)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill7, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(-0.3, 0.7, 0.45)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })
    this.loader.load(pill8, (gltf) =>{
        console.log(gltf);

        this.scene.add(gltf.scene);
        gltf.scene.traverse(o=>{
            if(o.isMesh){
                // o.geometry.center();
                o.scale.set(0.02, 0.02, 0.02)
                o.position.set(-0.6, 0.7, 0.)
                // o.material = new THREE.MeshPhongMaterial({color: 0x000000});
            }
        })

    })

    this.audioContext = new window.AudioContext();
    this.audioElement = document.getElementById("myAudio");
    this.track = this.audioContext.createMediaElementSource(this.audioElement);
    this.analyser = this.audioContext.createAnalyser();
    this.track.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 128;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.playButton = document.querySelector("button");
    this.playButton.addEventListener(
    "click",
    () => {
        // Check if context is in suspended state (autoplay policy)
        if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
        }

        // Play or pause track depending on state
        if (this.playButton.dataset.playing === "false") {
        this.audioElement.play();
        this.playButton.dataset.playing = "true";
        } else if (this.playButton.dataset.playing === "true") {
        this.audioElement.pause();
        this.playButton.dataset.playing = "false";
        }
    },
    false
    );

    this.audioElement.addEventListener(
        "ended",
        () => {
          this.playButton.dataset.playing = "false";
        },
        false
      );
    
}

stop(){
    this.isPlaying = false;
}

play(){
    if(!this.isPlaying){
        this.renderer()
        this.isPlaying = true;
    }

}

render(){
    this.analyser.getByteFrequencyData(this.dataArray);
    if(!this.isPlaying) return;
    this.numbb = this.dataArray[20];
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.numbb.value = this.numbb;
    this.material.uniforms.progress.value = this.settings.progress;
    if(this.mouse){
    this.material.uniforms.mouse.value = this.mouse;
    }
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});

