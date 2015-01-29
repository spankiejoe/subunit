export function getCoords(lat, lng, flag) {
  var gamma = (90  - lat) * Math.PI / 180;
  var theta = (180 - lng) * Math.PI / 180;

  var x = 200 * Math.sin(gamma) * Math.cos(theta);
  var y = 200 * Math.cos(gamma);
  var z = 200 * Math.sin(gamma) * Math.sin(theta);

  if (flag) {
    return new THREE.Vector3(x, y, z);
  }

  return {x: x, y: y, z: z};
}

var colorScale = d3.scale.quantile()
  .range(['#fff5eb','#fdd0a2','#fd8d3c','#d94801','#7f2704','#ff0000'])
  .domain([0,10]);

export var getColor = (function () {
  var cache = {};

  return function (value) {
    var color = colorScale(value);

    if (!cache[color]) {
      cache[color] = new THREE.MeshPhongMaterial({color: color});
    }
    return cache[color];
  };
}())

// Reference: http://nisatapps.prio.org/armsglobe/

var origin = new THREE.Vector3(0,0,0);

export function arc(beg, end){

  var distance = beg.distanceTo(end);
  
  var mid = beg.clone().lerp(end, 0.5);
  var midLength = mid.length();

  mid.normalize();
  mid.multiplyScalar(midLength + distance * 0.7);

  var normal = (new THREE.Vector3()).subVectors(beg, end);
  normal.normalize();

  var distanceHalf = distance * 0.5;

  var begAnchor    = beg;
  var midbegAnchor = mid.clone().add(normal.clone().multiplyScalar( distanceHalf));
  var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceHalf));
  var endAnchor    = end;

  var splineCurveA = new THREE.CubicBezierCurve3(beg, begAnchor, midbegAnchor, mid);
  var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endAnchor, end);

  var vertexCount = Math.floor(distance * 0.02 + 6 ) * 10;

  var points = splineCurveA.getPoints(vertexCount);
  points = points.splice(0, points.length - 1); // Avoid Duplicate
  points = points.concat(splineCurveB.getPoints(vertexCount));

  var geometry = new THREE.Geometry();
  geometry.vertices = points;

  return geometry;
}





