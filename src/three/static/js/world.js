window.WORLD = {
    update: function (dt) {
        if (Instances.player) {
            Instances.player.update(dt,Instances.dungeon);
        }
        if (Instances.dungeon) {
            Instances.dungeon.update(dt,Instances.player);
        }
    }
}
