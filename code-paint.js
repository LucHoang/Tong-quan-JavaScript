class paint {
    constructor() {
        this.canvas = document.getElementById('board');
        this.canvas.width = 1500;
        this.canvas.height = 670;
        this.ctx = this.canvas.getContext('2d');
        this.drawBackgroundd();
        this.color = 'black';
        this.tool = 'pen';
        this.lineWidth = 5;
        this.currentPos = {
            X: 0,
            Y: 0
        };
        this.startPos = {
            X: 0,
            Y: 0
        }
        this.drawing - false;
        this.oldImage = null;

        this.undoStack = [];
        this.redoStack = [];
        this.image = new Image;
        this.image.src = this.canvas.toDataURL("image/bmp", 1.0);
        this.redoStack.push(this.image.src);

        this.listenEvent();
    }
    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            X: evt.clientX - rect.left,
            Y: evt.clientY - rect.top
        };
    }
    mousedown(event) {
        this.oldImage = new Image;
        this.oldImage.src = this.canvas.toDataURL("image/bmp", 1.0);

        let mousePos = this.getMousePos(event);
        this.startPos = this.getMousePos(event);
        this.drawing = true;
    }
    mousemove(event) {
        let mousePos = this.getMousePos(event);
        if (this.drawing) {
            switch (this.tool) {
                case 'pen':
                    this.drawLine(this.currentPos, mousePos);
                    break;
                case 'line':
                    this.clear();
                    this.drawLine(this.startPos, mousePos);
                    break;
                case 'rect':
                    this.clear();
                    this.drawRect(this.startPos, mousePos);
                    break;
                case 'circle':
                    this.clear();
                    this.drawCircle(this.startPos, mousePos);
                    break;
                case 'ellipse':
                    this.clear();
                    this.drawEllipse(this.startPos, mousePos);
                    break;
            }

        }
        this.currentPos = mousePos;
    }
    mouseup(event) {
        this.drawing = false;

        this.image.src = this.canvas.toDataURL("image/bmp", 1.0);
        this.undoStack.push(this.redoStack.pop());
        this.redoStack.length = 0;
        this.redoStack.push(this.image.src);
    }
    listenEvent() {
        this.canvas.addEventListener('mousedown', (event) => this.mousedown(event));
        this.canvas.addEventListener('mousemove', (event) => this.mousemove(event));
        this.canvas.addEventListener('mouseup', (event) => this.mouseup(event));
    }
    clear() {
        this.ctx.drawImage(this.oldImage, 0,0,this.canvas.width,this.canvas.height);

    }
    undo() {
        if (this.undoStack.length >= 1) {
            this.image.src = this.undoStack.pop();
            this.redoStack.push(this.image.src);
            this.ctx.drawImage(this.image, 0,0,this.canvas.width,this.canvas.height);
        }
    }
    redo() {
        if (this.redoStack.length >= 2) {
            this.image.src = this.redoStack.pop();
            this.undoStack.push(this.image.src);
            this.image2 = new Image;
            this.image2.src = this.redoStack[this.redoStack.length-1]
            this.ctx.drawImage(this.image2, 0,0,this.canvas.width,this.canvas.height);
        }
    }
    drawBackgroundd() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
    drawRect(startPos, endPos) {
        this.ctx.lineWidth=this.lineWidth;
        this.ctx.strokeStyle=this.color;
        this.ctx.beginPath();
        this.ctx.rect(startPos.X,startPos.Y,endPos.X-startPos.X,endPos.Y-startPos.Y);
        this.ctx.stroke();

    }
    drawCircle(startPos, endPos) {
        this.ctx.lineWidth=this.lineWidth;
        this.ctx.strokeStyle=this.color;
        this.ctx.beginPath();
        this.ctx.arc(startPos.X,startPos.Y,Math.abs((endPos.X+endPos.Y)-(startPos.X+startPos.Y)),0,2*Math.PI);
        this.ctx.stroke();
    }
    drawEllipse(startPos, endPos) {
        this.ctx.lineWidth=this.lineWidth;
        this.ctx.strokeStyle=this.color;
        this.ctx.beginPath();
        this.ctx.ellipse(startPos.X, startPos.Y, Math.abs(endPos.X-startPos.X), Math.abs(endPos.Y-startPos.Y), Math.PI, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
    drawLine(startPos, endPos) {
        this.ctx.lineWidth=this.lineWidth;
        this.ctx.strokeStyle=this.color;
        this.ctx.lineCap="round"
        this.ctx.beginPath();
        this.ctx.moveTo(startPos.X,startPos.Y);
        this.ctx.lineTo(endPos.X,endPos.Y);
        this.ctx.stroke();
    }

}

var p = new paint();

function changeColor(color) {
    p.color = color;
}
function eraser() {
    p.color = 'white';
    p.tool = 'pen';
}
function changeLineWidth(lineWidth) {
    p.lineWidth = lineWidth;
}
function setTool(tool) {
    p.tool = tool;
}
function undo() {
    p.undo();
}
function redo() {
    p.redo();
}
function reset() {
    window.location.reload();
}