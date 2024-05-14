let angle = 0;
let detailX = 20;
let detailY = 20;
let points = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    /*
    // Cube 3D
    points[0] = [[-0.5], [-0.5], [-0.5]];
    points[1] = [[ 0.5], [-0.5], [-0.5]];
    points[2] = [[ 0.5], [ 0.5], [-0.5]];
    points[3] = [[-0.5], [ 0.5], [-0.5]];
    points[4] = [[-0.5], [-0.5], [ 0.5]];
    points[5] = [[ 0.5], [-0.5], [ 0.5]];
    points[6] = [[ 0.5], [ 0.5], [ 0.5]];
    points[7] = [[-0.5], [ 0.5], [ 0.5]];
    */
  
    let l = Math.sqrt(2)/2;

    /*
    // Octahedron 3D
    points[0] = [[-0.5], [-0.5], [0]];
    points[1] = [[ 0.5], [-0.5], [0]];
    points[2] = [[ 0.5], [ 0.5], [0]];
    points[3] = [[-0.5], [ 0.5], [0]];
    points[4] = [[0], [0], [l]];
    points[5] = [[0], [0], [-l]];
    */

    // Octahedron 4D
    points[0] = [[-0.5], [-0.5], [0], [-0.5]];
    points[1] = [[ 0.5], [-0.5], [0], [-0.5]];
    points[2] = [[ 0.5], [ 0.5], [0], [-0.5]];
    points[3] = [[-0.5], [ 0.5], [0], [-0.5]];
    points[4] = [[0], [0], [l], [-0.5]];
    points[5] = [[0], [0], [-l], [-0.5]];

    points[6] = [[-0.5], [-0.5], [0], [0.5]];
    points[7] = [[ 0.5], [-0.5], [0], [0.5]];
    points[8] = [[ 0.5], [ 0.5], [0], [0.5]];
    points[9] = [[-0.5], [ 0.5], [0], [0.5]];
    points[10] = [[0], [0], [l], [0.5]];
    points[11] = [[0], [0], [-l], [0.5]];
}

function draw() {
    background(0);
    orbitControl();

    rotateX(-PI/2);

    const rotationXY = [
        [cos(angle), -sin(angle), 0, 0],
        [sin(angle), cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
  
    const rotationZW = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, cos(angle), -sin(angle)],
        [0, 0, sin(angle), cos(angle)],
    ];
  
    let projected = [];

    for (let i = 0; i < points.length; i++) {
        let rotated = matmul(rotationXY, points[i]);
        rotated = matmul(rotationZW, rotated);
    
        // Orthographic projection
        // const projection = [
        //   [1, 0, 0, 0],
        //   [0, 1, 0, 0],
        //   [0, 0, 1, 0],
        // ];
    
        // Perspective
        let distance = 2;
        let w = 1 / (distance - rotated[3]);
        const projection = [
            [w, 0, 0, 0],
            [0, w, 0, 0],
            [0, 0, w, 0],
        ];
    
        let projected3d = matmul(projection, rotated);
        projected[i] = [height/2 * projected3d[0],
                    height/2 * projected3d[1],
                    height/2 * projected3d[2]];
    }

    for (let i = 0; i < projected.length; i++) {
        stroke(255);
        strokeWeight(16);
        const v = projected[i];
        point(v[0], v[1], v[2]);
    }

    // Connecting

    /*
    // Cube connections
    for (let i = 0; i < 4; i++) {
        connect(i,     (i + 1) % 4, projected);
        connect(i + 4, (i + 1) % 4 + 4, projected);
        connect(i,     i + 4, projected);
    }
    connect(3, 5, projected);
    */

    // Octahedron connections (1 & 2)
    connect(0, 1, projected, RED);
    connect(0, 3, projected, RED);
    connect(0, 4, projected, RED);
    connect(0, 5, projected, RED);
    connect(1, 2, projected, RED);
    connect(1, 4, projected, RED);
    connect(1, 5, projected, RED);
    connect(2, 3, projected, RED);
    connect(2, 4, projected, RED);
    connect(2, 5, projected, RED);
    connect(3, 4, projected, RED);
    connect(3, 5, projected, RED);

    connect(6, 7, projected, BLUE);
    connect(6, 9, projected, BLUE);
    connect(6, 10, projected, BLUE);
    connect(6, 11, projected, BLUE);
    connect(7, 8, projected, BLUE);
    connect(7, 10, projected, BLUE);
    connect(7, 11, projected, BLUE);
    connect(8, 9, projected, BLUE);
    connect(8, 10, projected, BLUE);
    connect(8, 11, projected, BLUE);
    connect(9, 10, projected, BLUE);
    connect(9, 11, projected, BLUE);

    // Connect two shapes
    for (let i = 0; i < 6; i++) {
        connect(i, i + 6, projected, GREEN);
    }

    angle += 0.02;
}

function connect(i, j, points, color) {
    const a = points[i];
    const b = points[j];
    stroke(color);
    strokeWeight(1);
    line(a[0], a[1], a[2], b[0], b[1], b[2]);
}

function matmul(matrixA, matrixB) {
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    if (colsA !== rowsB) {
        throw new Error("Matrix dimensions are not compatible for multiplication.");
    }

    // Create an empty result matrix
    const result = new Array(rowsA).fill()
        .map(() => new Array(colsB).fill(0));
  
    // Perform matrix multiplication
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}