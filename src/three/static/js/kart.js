// entities.js
window.SCENES = {
};
window.GAME = new function() {
    var scene = new THREE.Scene();
    var loader = new THREE.ColladaLoader();
    var cameraTarget = new THREE.Vector3( 0, 0, 0 );
    var textures = {loaded:0,COUNT:2};
    var objectLibrary = {};
    var mode = 'title';
    var renderer;
    var dungeon;
    var c = 0;
    var audioLoader = new THREE.AudioLoader();

    function setupCamera() {
        var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15);
        camera.position.set( 0, 10, 0 );
        return camera;
    }

    function runSongLoop() {
        var listener = new THREE.AudioListener();
        camera.add( listener );
        var sound = new THREE.Audio( listener );
        audioLoader.load( 'static/audio/loop.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            sound.play();
        });
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
        var groundTexture = loader.load( 'static/textures/cave_1.png', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 18, 12 );
            textures.ground = texture;  
            textures.loaded += 1;
            checkFinishedLoadingTextures();
        });
        var wallTexture = loader.load( 'static/textures/cave_1.png', function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 2, 2 );
            textures.walls = texture;  
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
            new THREE.PlaneBufferGeometry( BOUNDS.right-BOUNDS.left, BOUNDS.bottom-BOUNDS.top ),
            groundMaterial 
        );


        plane.rotation.x = -Math.PI/2;
        plane.position.y = -0.5;
        scene.add( plane );

        plane.receiveShadow = true;

        var wallMaterial = new THREE.MeshPhongMaterial( {
            color: 0x333333,
            map: textures.walls,  
        });

        var wall = new THREE.Mesh(
            new THREE.CubeGeometry( 1, 1, 1),
            wallMaterial
        );
        objectLibrary.Wall = wall;
    }

    function loadObjectLibrary() {
        loader.load("static/models/kart.dae", function(collada) {
            var package = collada.scene;
            collada.scene.scale.set(0.1, 0.1, 0.1);
            collada.scene.rotation.z = -Math.PI/4;
            console.log(collada);
            for(var i=0;i<collada.scene.children.length; i++){
                var obj = collada.scene.children[i];
                obj.rotation.x = -Math.PI/2;
                obj.scale = obj.scale.multiplyScalar(0.1);
                obj.position.y = -0.4;
                objectLibrary[obj.name] = obj; 
            }
            console.log(objectLibrary);
            objectsLoaded();
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

        scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x111122 ) );
        addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
        addShadowedLight( 0.5, 1, -1, 0xeeaaaa, 1 );
    }

    function init(){
        loadTextures();
    } 

    function texturesLoaded(){
        loadObjectLibrary();
    }

    function objectsLoaded(){
        initWorld();
    }

    function instancePlayer(){
        Instances.player = new Entities.Player(objectLibrary.Player); 
        Instances.player.addToScene(scene);

    }

    function instanceDungeon(){
        dungeon = new Dungeon();
        dungeon.loadRooms(DUNGEON_MAP,objectLibrary,scene);
        Instances.dungeon = dungeon;        
        window.dungeon = dungeon; // for manual debug
    }

    function initWorld(){
        window.camera = setupCamera();
        setupGround();
        addLight();
        instancePlayer();
        instanceDungeon();
        renderer = setupRenderer();
        window.SCENES.game = scene;
        titleMode();
        animate();
    }
    var startMS, endMS = 0;

    function animate() {
        c++;
        startMS = new Date().getMilliseconds();
        requestAnimationFrame(animate);
        camera.lookAt(cameraTarget);
        if (mode == "title") {
            //camera.position.y += (0.1 * Math.sin(c))
            camera.position.x += 0.01 * Math.cos(c * 0.01)
        }
        WORLD.update(endMS == 0 ? 0 : endMS - startMS);
        renderer.render(scene, camera);
        endMS = new Date().getMilliseconds();
    }

    var gameMode = function() {
        mode = 'game';
        runSongLoop();
        camera.position.set( 0, 10, 0 );
    }

    var titleMode = function() {
        mode = 'title';
        camera.position.x = -1.2;
        camera.position.y = 1;
        camera.position.z = 2;
    }
    
    this.gameMode = gameMode;
    this.titleMode = titleMode;

    init();
};
