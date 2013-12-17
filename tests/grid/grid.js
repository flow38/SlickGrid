(function ($) {
  
  var grid;
  var el, offsetBefore, offsetAfter, dragged;
  
  var drag = function(handle, dx, dy) {
    offsetBefore = el.offset();
    $(handle).simulate("drag", {
      dx: dx || 0,
      dy: dy || 0
    });
    dragged = { dx: dx, dy: dy };
    offsetAfter = el.offset();
  }
  
  var moved = function (dx, dy, msg) {
    msg = msg ? msg + "." : "";
    var actual = { left: offsetAfter.left, top: offsetAfter.top };
    var expected = { left: offsetBefore.left + dx, top: offsetBefore.top + dy };
    same(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
  }
  
  var ROWS = 500, COLS = 10;
  var data = [], row;
  for (var i = 0; i < ROWS; i++) {
    row = { id: "id_" + i };
    for (var j = 0; j < COLS; j++) {
      row["col_" + j] = i + "." + j;
    }
    data.push(row);
  }
  
  var cols = [], col;
  for (var i = 0; i < COLS; i++) {
    cols.push({
      id: "col" + i,
      field: "col_" + i,
      name: "col_" + i
    });
  }
  
  cols[0].minWidth = 70;

  grid = new Slick.Grid("#container", data, cols, {testMode:true});
  grid.render();

  module("grid - column resizing");
  
  test("minWidth is respected", function () {
    var firstCol = $("#container .slick-header-column:first");
    firstCol.find(".slick-resizable-handle:first").simulate("drag", { dx: 100,  dy: 0 });
    firstCol.find(".slick-resizable-handle:first").simulate("drag", { dx: -200, dy: 0 });
    equal(firstCol.outerWidth(), 70, "width set to minWidth");
  });
  
  test("onColumnsResized is fired on column resize", function () {
    expect(2);
    grid.onColumnsResized.subscribe(function() { ok(true,"onColumnsResized called") });
    var oldWidth = cols[0].width;
    $("#container .slick-resizable-handle:first").simulate("drag", { dx: 100, dy: 0 });
    equal(cols[0].width, oldWidth+100-1, "columns array is updated");
  });
  
  test("getData should return data", function () {
    equal(grid.getData(), data);
  });
  
   /**
     * Option stepfyScroll
     */
    var onScroll = null;
    module("Functionnal Test - Option stepfyScroll ",  {
        setup: function() {
           
        },
        teardown: function(){
            grid.onScroll.unsubscribe(onScroll);
            $('.slick-viewport').scrollTop(0);
            grid.handleScroll();
            grid.setOptions({stepfyScroll: false});
        }
    });
    
    test("stepfyScroll Off", function(GridUtils) {
        
        expect(1);
        onScroll = function(e, args){
            equal(args.scrollTop, 234);
        }
        //Simulate scrolling
        grid.onScroll.subscribe(onScroll);
        $('.slick-viewport').scrollTop(234);
        grid.handleScroll();
    });
    
    test("stepfyScroll On", function() {
        expect(1);
        
        //Enable stepfy option
        grid.setOptions({stepfyScroll: true});
        
        //Listen for scrolling event
        onScroll = function(e, args){
            equal(args.scrollTop, 250);
        }
        grid.onScroll.subscribe(onScroll);
        
        //Simulate scrolling
        $('.slick-viewport').scrollTop(234);
        grid.handleScroll();
    });
  
})(jQuery);