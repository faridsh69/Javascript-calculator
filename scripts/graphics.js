function fillRectangle(x, y, w, h, color) {
	var oDiv = document.createElement("div");
	oDiv.style.position = "absolute";
	oDiv.style.display = 'block';
	oDiv.style.posLeft= x;
	oDiv.style.posTop = y;
	oDiv.style.posWidth = w;
	oDiv.style.posHeight = h;
	oDiv.style.backgroundColor = color;
	oDiv.style.overflow = 'hidden';

	document.body.appendChild(oDiv);
}


function drawPixel(x, y, color, strong) {
	var oDiv = document.createElement("div");
	oDiv.style.position = "absolute";
	oDiv.style.display = 'block';
	oDiv.style.left= x - parseInt(strong/2);
	oDiv.style.top = y - parseInt(strong/2);
	oDiv.style.width = strong;
	oDiv.style.height = strong;
	oDiv.style.backgroundColor = color;
	oDiv.style.overflow = 'hidden';

	document.body.appendChild(oDiv);
	
	arrayDivs.push(oDiv);
}


function drawLine(x1, y1, x2, y2, color, strong) {

	if (x1 > x2) {
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2 - x1;
	var dy = Math.abs(y2 - y1);
	var x = x1;
	var y = y1;
	var yIncr = 1;
	if (y1 > y2) {
		yIncr = -1;
	}
	var drw = true;
	if (dx >= dy) {
		var pr = dy << 1;
		var pru = pr - (dx << 1);
		var p = pr - dx;
		while ((dx--) > 0) {
			if (drw) {
				drawPixel(x, y, color, strong);
			}
			drw = !drw;
			if (p > 0) {
				y += yIncr;
				p += pru;
			} else {
				p += pr;
			}
			++x;
		}
		if (drw) { 
			drawPixel(x, y, color, 1);
		}
	} else 	{
		var pr = dx << 1;
		var pru = pr - (dy << 1);
		var p = pr - dy;
		while ((dy--) > 0) {
			if (drw) {
				drawPixel(x, y, color, strong);
			}
			drw = !drw;
			y += yIncr;
			if (p > 0) {
				++x;
				p += pru;
			} else {
				p += pr;
			}
		}
		if (drw) {
			drawPixel(x, y, color, strong);
		}
	}
}


function drawRectangle(x, y, w, h, color, strong) {
	drawLine(x, y, x + w, y, color, strong);
	drawLine(x, y + h, x + w, y + h, color, strong);
	drawLine(x, y, x, y + h, color, strong);
	drawLine(x + w, y, x + w, y + h, color, strong);
}


function drawEllipse(x, y, h, w, color, strong) {
	var a = w >> 1;
	var b = h >> 1;
	var wod = w & 1;
	var hod = h & 1;
	var cx = x + a;
	var cy = y + b;
	x = 0;
	y = b;
	var aa2 = (a * a) << 1;
	var aa4 = aa2 << 1;
	var bb = (b * b) << 1;
	var st = (aa2 >> 1) * (1 - (b << 1)) + bb;
	var tt = (bb >> 1) - aa2 * ((b << 1) - 1);
	var drw = true;
	while (y > 0) {
		if (st < 0) {
			st += bb * ((x << 1) + 3);
			tt += (bb << 1) * (++x);
		} else if (tt < 0) {
			st += bb * ((x << 1) + 3) - aa4 * (y - 1);
			tt += (bb << 1) * (++x) - aa2 * (((y--) << 1) - 3);
		} else {
			tt -= aa2 * ((y << 1) - 3);
			st -= aa4 * (--y);
		}
		if (drw) {
			drawPixel(x + wod + cx, -y + cy, color, strong);
			drawPixel(x + wod + cx, y + hod + cy, color, strong);
			drawPixel(-x + cx, y + hod + cy, color, strong);
			drawPixel(-x + cx, -y + cy, color, strong);
		}
		drw = !drw;
	}

}


function fillEllipse(x, y, h, w, color) {

	var a = (w -= 1) >> 1;
	var b = (h -= 1) >> 1;
	var wod = (w & 1) + 1;
	var hod = (h & 1) + 1;
	var cx = x + a;
	var cy = y + b;
	x = 0;
	y = b;
	var ox = 0;
	var oy = b;
	var aa2 = (a * a) << 1;
	var aa4 = aa2 << 1;
	var bb = (b * b) << 1;
	var st = (aa2 >> 1) * (1 - (b << 1)) + bb;
	var tt = (bb >> 1) - aa2 * ((b << 1) - 1);
	var pxl, dw, dh;
	if (w + 1) {
		while (y > 0) {
			if (st < 0) {
				st += bb * ((x << 1) + 3);
				tt += (bb << 1) * (++x);
			} else if (tt < 0) {
				st += bb * ((x << 1) + 3) - aa4 * (y - 1);
				pxl = cx - x;
				dw = (x << 1) + wod;
				tt += (bb << 1) * (++x) - aa2 * (((y--) << 1) - 3);
				dh = oy - y;
				fillRectangle(pxl, cy - oy, dw, dh, color);
				fillRectangle(pxl, cy + oy - dh + hod, dw, dh, color);
				ox = x;
				oy = y;
			} else 	{
				tt -= aa2 * ((y << 1) - 3);
				st -= aa4 * (--y);
			}
		}
	}
	fillRectangle(cx - a, cy - oy, w + 1, (oy << 1) + hod, color);

}
