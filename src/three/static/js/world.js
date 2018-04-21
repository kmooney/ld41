window.WORLD = {
    update: function (dt) {
        if (Instances.player) {
            Instances.player.update(dt);
        }
    }
}