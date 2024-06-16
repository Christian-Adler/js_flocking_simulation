class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  mult(val) {
    this.x *= val;
    this.y *= val;
    return this;
  }

  add(xVal, yVal) {
    this.x += xVal;
    this.y += yVal;
    return this;
  }

  addVec(vec) {
    return this.add(vec.x, vec.y);
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  toRadians() {
    if (this.x === 0) {
      if (this.y >= 0)
        return Math.PI / 2;
      else
        return Math.PI * 3 / 2;
    }
    if (this.x > 0) {
      if (this.y >= 0)
        return Math.atan(this.y / this.x);
      else
        return 2 * Math.PI - Math.atan(-this.y / this.x);
    } else {
      if (this.y >= 0)
        return Math.PI - Math.atan(this.y / -this.x);
      else
        return Math.PI + Math.atan(-this.y / -this.x);
    }
  }

  static fromAngle(radians) {
    if (radians < 0) radians += Math.PI * 2;
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return new Vector(x, y);
  }
}

export {Vector};