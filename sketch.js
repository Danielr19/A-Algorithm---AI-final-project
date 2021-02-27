//Made by Daniel Rodríguez Arceo 
function removeFromArray(arr,elt)
{
    for(var i = arr.length-1; i >= 0; i--)
    {
        if(arr[i] == elt)
        {
            arr.splice(i,1);
        }
    }
}

function heuristic(a,b)
{
    //Eucledian distance heuristic
    var d = dist(a.i,a.j,b.i,b.j);

    //Manhattan distance or taxi cab distance heuristic
    //var d = abs(a.i-b.i) + abs(a.j - b.j);
    return d;
}
var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];
var carPath = [];
const Example = "Maze";

function Spot(i,j)
{   
    this.i = i; 
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    //Random obstacle generation
    if(random(1) < 0.3)
    {
        this.wall = true;
    }
    this.show = function(col)
    {
        fill(col);
        //Original IF used to draw obstacles
        if(this.wall)
        {
            fill(0);
            //noStroke();
            //stroke(0);
            //ellipse(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);

            stroke(0);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }   

        //Next ifs are used to draw the sorrounding walls
        //Comment to run GPS tracker
        if(this.j == rows-rows && this.i != 0)
        {
            this.wall = true;
            fill(0);
            
            stroke(0);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }
        if(this.i == cols-cols && this.j != 0)
        {
            this.wall = true;
            fill(0);
            stroke(0);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }
        if(this.i == cols-1 && this.j != rows-1)
        {
            this.wall = true;
            fill(0);
            stroke(0);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }
        if(this.j == rows-1 && this.i != cols-1)
        {
            this.wall = true;
            fill(0);
            stroke(0);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }
        //until this line to run GPS tracker
        
        //rect(this.i*w,this.j*h, w-1, h-1);
        if(this.i == cols-1 && this.j == rows-2)
        {
            this.walls = false;
            fill(255);
            stroke(255);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }
        if(this.j == rows-1 && this.i == cols-2)
        {
            this.walls = false;
            fill(255);
            stroke(255);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2);
        }
        if(this.j == cols-1 && this.i == rows-1)
        {
            this.walls = false;
            fill(255);
            stroke(255);
            rect(this.i * w + w/2, this.j * h + h / 2, w/2, h/2)
            end = grid[cols-1][rows-1];
        }
    }

    this.addNeighbors = function(grid)
    {
        var i = this.i;
        var j = this.j;
        if(i < cols-1)
        {
            this.neighbors.push(grid[i+1][j]);
        }
        if(i>0)
        {
            this.neighbors.push(grid[i-1][j]);
        }
        if(j < rows-1)
        {
            this.neighbors.push(grid[i][j+1]);
        }
        if(j>0)
        {
            this.neighbors.push(grid[i][j-1]);
        }
        if(i>0 && j > 0)
        {
            this.neighbors.push(grid[i-1][j-1]);
        }
        if(i<cols-1 && j > 0)
        {
            this.neighbors.push(grid[i+1][j-1]);
        }
        if(i>0 && j < rows-1)
        {
            this.neighbors.push(grid[i-1][j+1]);
        }
        if(i<cols-1 && j < rows-1)
        {
            this.neighbors.push(grid[i+1][j+1]);
        }

    }

    
}

let car = [];
let Objective;

function preload()
{
    car = loadImage('car.png'); //load the image for the car
    Objective = loadImage('objective.png'); //load the image fot the objecive to reach
    //carMovable = document.getElementById('carImg');
    car[0] =  new Bubble(5, 5, 10); //5, 5, 10 to center the car
}

function setup()
{
    //Initialize the object for the car picture un position (0,0)
    createCanvas(400,400);
    console.log('A*');
    
    w = width/cols;
    h = height/rows;
    //Making a 2D Array
    for(var i = 0; i < cols; i++)
    {
        grid[i] = new Array(rows);
    }
    for(var i = 0; i < cols; i++)
    {
        for(var j = 0; j < rows; j++)
        {
            grid[i][j] = new Spot(i,j);
        }
    }
    for(var i = 0; i < cols; i++)
    {
        for(var j = 0; j < rows; j++)
        {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall = false;

    openSet.push(start);

    console.log(grid);
}

function draw()
{   
    if(openSet.length > 0)
    {
        var winner = 0;
        for(var i = 0; i < openSet.length; i++)
        {
            if(openSet[i].f < openSet[winner].f)
            {
                winner = i;
            }
        }
        var current = openSet[winner];


        if(current === end)
        {
            if(Example == "Maze")
            {
                noLoop();
                console.log("MAZE SOLVED!!!");
            }
            if(Example == "GPS")
            {
                noLoop();
                console.log("Most optimal path found!");
            }
            if(Example == "Default")
            {
            noLoop();
            console.log("DONE!");
            }
        }

        removeFromArray(openSet, current);
        //openSet.remove(current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for(var i = 0;  i < neighbors.length; i++)
        {
            var neighbor = neighbors[i];

            if(!closedSet.includes(neighbor) && !neighbor.wall)
            {
                var tempG = current.g+1;

                var newPath = false;
                if(openSet.includes(neighbor))
                {
                  if(tempG < neighbor.g)
                  {
                    neighbor.g = tempG;
                    newPath = true;
                  }  
                }else{
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                
                if(newPath)
                {
                neighbor.h = heuristic(neighbor,end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
                }

            }
            neighbor.g = current.g+1;
        }

        //we can keep going
    }else{
        //no solution
        console.log("no solution");
        noLoop();
        return;
        
    }
    background(255);
    
    for(var i=0; i < cols; i++)
    {
        for(var j = 0; j < rows; j++)
        {
            grid[i][j].show(color(255))
        }
    }

    for(var i = 0; i < closedSet.length; i++)
    {
        closedSet[i].show(color(255,0,0));
    }
    for(var i = 0; i < openSet.length; i++)
    {
        openSet[i].show(color(0,255,0));
    }

    //Find the path
    
    
    path = [];
    carPath = [];
    var temp = current;
    path.push(temp);
    carPath.push(temp);
    while (temp.previous)
    {
        path.push(temp.previous);
        //carPath.push(temp.previous);
        temp = temp.previous;
    }
    

    for (var i = 0; i < path.length; i++)
    {
        //path[i].show(color(0,0,255));
        
    } 

    noFill();
    stroke(255,0,255);
    strokeWeight(w / 2); 
    beginShape();
    for(var i = 0; i < path.length; i++)
    { 
        vertex(path[i].i * w + w / 2, path[i].j * h  + h/2);
        //image(car, path[i].i * w + w / 4, path[i].j * h  + h/4, width/10, height/10);
        
        //Intentar hacer que se cree el objeto con JS al parecer no se pueden mover entidades de HTML
    }
    /*for(var i = 0; i < carPath.length; i++) //Comment to run maze
    {
        //car[0].move(carPath[i].i * w + w / 2, carPath[i].j * h  + h/2); To center car
        car[0].move((carPath[i].i * w + w / 2)-20, (carPath[i].j * h  + h/2)-14);
        car[0].show();
    }*/
    endShape();
    image(Objective, rows+335, cols+335, width/20, height/20);
}

class Bubble
{
    constructor(x,y,r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    move(First, Second)
    {
        this.x =  First;
        this.y = Second;
    }

    show()
    {
        //stroke(255);
        //strokeWeight(1);
        //fill(133);
        image(car,this.x -15 ,this.y -15, width/10, height/10);
        //ellipse(this.x, this.y, this.r*2);
    }
}