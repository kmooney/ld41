
function() {
    var scene = new THREE.Scene();
    var loader = new THREE.ColladaLoader();
    var cameraTarget = new THREE.Vector3( 0, 0, 0 );

    function setupCamera() {
        var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15);
        camera.position.z = 15;
        camera.position.set( 3, 0.15, 3 );
        return camera;
    }

    function setupRenderer() {
        var renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    function setupGround() {
        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 40, 40 ),
            new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        );
        plane.rotation.x = -Math.PI/2;
        plane.position.y = -0.5;
        scene.add( plane );

        plane.receiveShadow = true;
    }

    function loadKart() {
        loader.load("static/models/kart.dae", function(collada) {
            console.log("Loaded", collada);
            var package = collada.scene;
            collada.scene.scale.set(0.1, 0.1, 0.1);
            collada.scene.rotation.z = -Math.PI/4;
            scene.add(collada.scene);

            //scene.add(collada.scene.children);
        });
    }

    function addLight() {
        function addShadowedLight( x, y, z, color, intensity ) {
            var directionalLight = new THREE.DirectionalLight( color, intensity );
            directionalLight.position.set( x, y, z );
            scene.add( directionalLight );
            directionalLight.castShadow = true;

            var d = 1;
            directionalLight.shadow.camera.left = -d;
            directionalLight.shadow.camera.right = d;
            directionalLight.shadow.camera.top = d;
            directionalLight.shadow.camera.bottom = -d;
            directionalLight.shadow.camera.near = 1;
            directionalLight.shadow.camera.far = 4;
            directionalLight.shadow.mapSize.width = 1024;
            directionalLight.shadow.mapSize.height = 1024;
            directionalLight.shadow.bias = -0.001;

        }

        scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
        addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
        addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );
    }

    window.camera = setupCamera();
    setupGround();
    addLight();
    loadKart();
    var renderer = setupRenderer();

    function animate() {
        requestAnimationFrame(animate);
        camera.position.z = 0;
        camera.position.x = 0;
        camera.position.y = 10;


        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
    }
    animate();
})()