class TilePoint {
    constructor(Terrain, UnitObjectList, ItemObjectList) {
        this.Terrain = Terrain;
        this.UnitObjectList = UnitObjectList;
        this.ItemObjectList = ItemObjectList;
    };

};

class Point {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r || 0;
    }
}

class HoverPoint extends Point {
    constructor(x, y, r, color, hoverColor) {
        super(x, y, r);
        this.color = color;
        this.hoverColor = hoverColor;
        this.hovered = false;
        this.path = new Path2D();
    }

    draw() {
        this.hovered ? ctx.fillStyle = this.hoverColor : ctx.fillStyle = this.color;
        this.path.arc(this.x, this.y, this.r, 0, twoPie);
        ctx.fill(this.path);
    }
}
class Cursor extends Point {
    constructor(x, y, r) {
        super(x, y, r);
    }

    collisionCheck(points) {
        // This is the method that will be called during the animate function that 
        // will check the cursors position against each of our objects in the points array.
        document.body.style.cursor = "default";
        points.forEach(point => {
            point.hovered = false;
            if (ctx.isPointInPath(point.path, this.x, this.y)) {
                document.body.style.cursor = "pointer";
                point.hovered = true;
            }
        });
    }
}


function createPoints() {
    // Create your points and add them to the points array.
    points.push(new HoverPoint(cx, cy, 100, 'red', 'coral'));
    points.push(new HoverPoint(cx + 250, cy - 100, 50, 'teal', 'skyBlue'));
    // ....
}




createPoints();
update();
canvas.onmousemove = animate;

export default {
    Tile
}