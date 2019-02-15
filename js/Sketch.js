let grid;

function setup(rows, cols, numBombs)
{
  grid = Array2DCreator(rows, cols);
  PlaceBombs(grid, numBombs);

  for (let j = 0; j < grid.length; j++)
  {
    for (let k = 0; k < grid[j].length; k++)
    {
      grid[j][k].checkNeighbor(grid, rows, cols);
    }
  }
  return grid;
}


function PlaceBombs(grid, numBombs)
{
  console.log(grid);
  let x = (Math.floor(Math.random() * grid.length));
  let y = (Math.floor(Math.random() * grid[x].length));
  for(let i=0; i<numBombs; i++)
  {

    while(grid[x][y].bomb == true)
    {
      x = (Math.floor(Math.random() * grid.length));
      y = (Math.floor(Math.random() * grid[x].length));
    }
    grid[x][y].bomb = true;
  }
}


function Array2DCreator(row, col)
{
  let array2D = new Array(row);
  console.log(typeof(row));
  for (let i = 0; i < array2D.length; i++)
  {
      array2D[i] = new Array(col);
      for (let j = 0; j < array2D[i].length; j++)
      {
        array2D[i][j] = new Square(i, j);
      }
  }
  return(array2D);
}


function Square(i, j)
{
  this.i=i;
  this.j=j;
  this.bombnearby=0;
  this.bomb = false;
  this.revealed=false;
  this.flagged=false;
  this.key=-1;
}

//Returns true if the given position is within the board's bounds.
function IsWithinBoard(PosX, PosY)
{
  return PosX < grid.length && PosY < grid[0].length && PosX >= 0 && PosY >= 0;
}

//Reveals the tile at the given position and recursively calls the tiles around it.
function RevealTile(PosX, PosY)
{
  if(!grid[PosX][PosY].revealed)
  {
    grid[PosX][PosY].recreveal();
  }
}

//Checks if a position is within the board's bounds, then reveals that tile.
function CheckTile(PosX, PosY)
{
  if(IsWithinBoard(PosX, PosY))
  {
    RevealTile(PosX, PosY)
  }
}

//Checks the tile up and to the left of the given tile.
Square.prototype.TopLeft = function(func)
{
  return func(this.i - 1, this.j - 1);
}

//Checks the tile directly above the given tile.
Square.prototype.TopMiddle = function(func)
{
  return func(this.i, this.j - 1);
}

//Checks the tile up and to the right of the given tile.
Square.prototype.TopRight = function(func)
{
  return func(this.i + 1, this.j - 1);
}

//Checks the tile directly to the left of the given tile.
Square.prototype.Left = function(func)
{
  return func(this.i - 1, this.j);
}

//Checks the tile directly to the right of the given tile.
Square.prototype.Right = function(func)
{
  return func(this.i + 1, this.j);
}

//Checks the tile down and to the left of the given tile.
Square.prototype.BottomLeft = function(func)
{
  return func(this.i - 1, this.j + 1);
}

//Checks the tile directly below the given tile.
Square.prototype.BottomMiddle = function(func)
{
  return func(this.i, this.j + 1);
}

//Checks the tile down and to the right of the given tile.
Square.prototype.BottomRight = function(func)
{
  return func(this.i + 1, this.j + 1);
}

//Recursively reveals the tiles by checking the contents, then the surrounding tiles.
Square.prototype.recreveal = function(){
  if(this.bomb === false)
  {
    this.revealed=true;

    //If the tile clicked is blank then recurse.
    if(this.bombnearby==0)
    {
      //Set the image to the blank image.
      this.key=0;

      //Checks each of the 8 positions around the tile and reveals the non bombs.
      this.TopLeft(CheckTile);
      this.TopMiddle(CheckTile);
      this.TopRight(CheckTile);
      this.Left(CheckTile);
      this.Right(CheckTile);
      this.BottomLeft(CheckTile);
      this.BottomMiddle(CheckTile);
      this.BottomRight(CheckTile);

    }
    else
    { //Otherwise the tile clicked is a number, so reveal the number.
      this.revealed = true;
      this.key = this.bombnearby;
    }
  }
  else
  {
    //Call lose function because user clicked a bomb.
    this.revealed = true;
  }
}

function IsBomb(PosX, PosY)
{
  if(IsWithinBoard(PosX, PosY))
  {
    if(grid[PosX][PosY].bomb==true)
    {
      return 1;
    }
    else
    {
      return 0;
    }
  }
  else
  {
    return 0;
  }
}

//Calculates the values around the bombs to display.
Square.prototype.checkNeighbor = function(grid, rows, cols){
  this.bombnearby += this.TopLeft(IsBomb);
  this.bombnearby += this.TopMiddle(IsBomb);
  this.bombnearby += this.TopRight(IsBomb);
  this.bombnearby += this.Left(IsBomb);
  this.bombnearby += this.Right(IsBomb);
  this.bombnearby += this.BottomLeft(IsBomb);
  this.bombnearby += this.BottomMiddle(IsBomb);
  this.bombnearby += this.BottomRight(IsBomb);
}

Square.prototype.placebommb = function(){
   this.bomb=true;
}

Square.prototype.flag = function(){
  this.flagged=true;
  this.key=9;
}

Square.prototype.keyprinting = function(){
  console.log(this.key);
}
