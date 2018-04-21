
(function() {
    var scene = new THREE.Scene();
    var loader = new THREE.ColladaLoader();
    var cameraTarget = new THREE.Vector3( 0, 0, 0 );
    var textures = {loaded:0,COUNT:1};
    var renderer;

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

    function loadTextures() {
        var loader = new THREE.TextureLoader();
        var groundTexture = loader.load( 'static/textures/cave.png', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 2, 2 );
            textures.ground = texture;  
            textures.loaded += 1;
            checkFinishedLoadingTextures();
        });
    }

    function checkFinishedLoadingTextures(){
        if(textures.loaded == textures.COUNT){
            texturesLoaded(); 
        }
    }
    function setupGround() {

        var groundMaterial = new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            map: textures.ground,  
        });

        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 40, 40 ),
            groundMaterial 
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

    function init(){
        loadTextures();
    } 

    function texturesLoaded(){
        window.camera = setupCamera();
        setupGround();
        addLight();
        loadKart();
        renderer = setupRenderer();
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        camera.position.z = 0;
        camera.position.x = 0;
        camera.position.y = 10;


        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
    }

    init();
})()
