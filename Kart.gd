extends KinematicBody

# class member variables go here, for example:
# var a = 2
# var b = "textvar"
var velocity
const SPEED = 50
const MAX_SPEED = 300
const BRAKE = -50
const FRICTION = 0.1

func _ready():
	velocity = Vector3()
	translation.y = 10

func _physics_process(delta):
	var v = Vector3(0,0,0)
	if Input.is_action_pressed("ui_up"):
		if velocity.length() < MAX_SPEED:
			v.z = SPEED * delta
	if Input.is_action_pressed("ui_down"):
		if velocity.length() > 0:
			v.z = BRAKE * delta
			
	v = v.rotated(Vector3(0,1,0),rotation.y)
	
	if Input.is_action_pressed("ui_right"):
		rotation.y -= 0.01
	if Input.is_action_pressed("ui_left"):
		rotation.y += 0.01

	var vfric = velocity.inverse() * FRICTION
	velocity = move_and_slide(v+velocity)
#	# Called every frame. Delta is time since last frame.
#	# Update game logic here.
#	pass
