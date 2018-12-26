var nodes = [];
var links = [];

var svg = d3.select("svg").style("background-color", "white"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    node,
    link;

var g = svg.append("g");

svg
	
	.call(d3.zoom()
		    .scaleExtent([1/4, 8])
		    .on("zoom", zoomed))
		    .on("dblclick.zoom", null);

function zoomed() {
//	  g.attr("transform", d3.event.transform);
	g.attr("transform", d3.event.transform);
	}

$("#exploreBtn").on('click', function () {
  var startNode = $('#headingChoice').text();
  $('#choiceDiv').css("display", "none");
  $('#headingChoice').css('display', 'none');
  $('.content').css('display', 'none');
  $('#exploreDiv').css('display', 'block');
  getNodesData(startNode);
});

function getNodesData(nodeId) {
	var selectedOpt = $("#visualizationTypeGroup option:selected" ).text();
	  console.log("getNode/" + nodeId.replace(/#/g,"%23") + "/" + selectedOpt);
	  if(selectedOpt !== null && selectedOpt !== '') {
		  d3.json("getNode/" + nodeId.replace(/#/g,"%23") + "/" + selectedOpt).then(function (data) {
				
		    updateData(data);
		    update();
		  });
	  } else {
//		  getPredicates();
	  }

  
}


console.log("width: " + width);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id })
        .distance(200).strength(0.5)
    )
    .force("charge", d3.forceManyBody()
        .strength(-400)
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

// var nodeId = 'nodes_id_1';
var nodeId = ['nodes_start', 'nodes_id_1', 'nodes_id_2', 'nodes_id_3'];

var i = 0;

$('#goBtn').on('click', function () {

    d3.json(nodeId[i] + ".json").then(function (data) {
        updateData(data);
        update();
    });
    i++;
    // nodeId = 'nodes_id_2';
})

function getNodeRelations(nodeId) {
    var selectedOpt = $("#visualizationTypeGroup option:selected" ).text();
	  console.log("getNodeData/" + nodeId.replace(/#/g,"%23") + "/" + selectedOpt);
	  if(selectedOpt !== null && selectedOpt !== '') {
		  d3.json("getNodeData/" + nodeId.replace(/#/g,"%23") + "/" + selectedOpt).then(function (data) {
				
		    updateData(data);
		    update();
		  });
	  } else {
//		  getPredicates();
	  }
}

$('#dragBtn').on('click', function () {
    node.fx = null;
    node.fy = null;



    console.log("dragBtn");
})

link = g.append("g").selectAll(".link");
var edgepaths = g.append("g").selectAll(".edgepath");
var edgelabels = g.append("g").selectAll(".edgelabel");
node = g.append("g").selectAll(".node");

function update() {
    console.log("update() entered");

    link = link.data(links, function (d) { return d.source + "-" + d.edge + "-" + d.target });
    link.exit().remove();
    link = link.enter()
        .append("line")
        .attr("id", function (d) { return d.source + "-" + d.edge + "-" + d.target })
        .attr("class", "link")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .merge(link);


    edgepaths = edgepaths.data(links, function (d, i) { return 'edgepath' + i });
    edgepaths.exit().remove();
    edgepaths = edgepaths
        .enter()
        .append('path')
        .merge(edgepaths)
//        .attr('d', function (d) {
//            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y
//        })

        .attr('class', 'edgepath')
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('id', function (d, i) { return 'edgepath' + i })
        .style("pointer-events", "none")
        ;
    console.log(links);

    edgelabels = edgelabels.data(links, function (d, i) { return 'edgelabel' + i });
    edgelabels.exit().remove();
    var edgelabelsEnter = edgelabels.enter()
        .append('text')
        .style("pointer-events", "none")
        .attr('class', 'edgelabel')
        .attr('id', function (d, i) { return 'edgelabel' + i })
        .attr('font-size', 10)
        .attr('fill', 'black')
        .attr('z-index', 1)
        ;

    edgelabels = edgelabelsEnter.merge(edgelabels);


    edgelabelsEnter
        .append('textPath')
        .attr('xlink:href', function (d, i) { return '#edgepath' + i })
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "40%")
        .text(function (d) { return d.edge })
        ;





    node = node.data(nodes, function (d) { return d.id; });

    node.exit().remove();
    var nodeEnter = node.enter()
        .append("g")
        .attr("id", function (d) { return d.id })
        .attr("class", "node")
        .on("mouseover", function () {
            $(this).css('cursor', 'pointer');
            d3.select(this).selectAll(".icon")
                .transition().delay(50).style("opacity", 1)
                ;
        })
        .on("mouseout", function () {
            d3.select(this).selectAll(".icon")
                .transition().delay(150).style("opacity", 0)
                ;
        })
        .on("dblclick", function (d) {
            getNodeRelations(d.id);
       
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
        )
        .attr("x", width/2)
        .attr("x", height/2)
        ;

    node = nodeEnter.merge(node);
    nodeEnter
        .append('svg:circle')
        .attr("class", "circle")
        .attr("r", 20)
        .attr("fill", "#fc8100")
        ;

    nodeEnter
        .append('svg:text')
        .text(function (d) { return d.label; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr('font-weight', 'bolder')
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 3)
        ;

    nodeEnter.append('svg:image')
        .attr("xlink:href", "js/delete.svg")
        .attr("x", 12)
        .attr("y", -26)
        .attr("width", 12)
        .attr("height", 12)
        .attr("class", "icon")
        .style("opacity", 0)
        .on("click", function (d) {
            console.log(d);
            console.log(nodes);
            if (nodes.length < 2) {
                return;
            }
            nodes = nodes.filter(function (n) {
                return n.id != d.id;
            });
            links = links.filter(function (l) {
                return d.id != l.source.id && d.id != l.target.id;
            });
            console.log(nodes);
            update();
        });
    nodeEnter.append('svg:image')
        .attr("xlink:href", "js/info.svg")
        .attr("x", -24)
        .attr("y", -26)
        .attr("width", 12)
        .attr("height", 12)
        .attr("class", "icon")
        .style("opacity", 0)
        .on("click", function () {
            alert("info");
        });

    nodeEnter.append('svg:image')
        .attr("xlink:href", "js/pin.svg")
        .attr("x", -5)
        .attr("y", -32)
        .attr("width", 12)
        .attr("height", 12)
        .attr("class", "icon")
        .style("opacity", 0)
        .on("click", function (d) {
            d.fx = null;
            d.fy = null;
        });


    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);
    simulation
        .alphaTarget(0.3)
        .restart();
}


function ticked() {
   


    link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

    edgepaths.attr('d', function (d) {
        return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    edgelabels.attr('transform', function (d) {
        if (d.target.x < d.source.x) {
            var bbox = this.getBBox();

            rx = bbox.x + bbox.width / 2;
            ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        }
        else {
            return 'rotate(0)';
        }
    });
    
    node
    .attr("transform", function (d) { return "translate(" + d.x + ", " + d.y + ")"; });
}

function dragstarted(d) {
    if (!d3.event.active) simulation
        .alphaTarget(0.3)
        .restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}
function dragended(d) {
    if (!d3.event.active) simulation
        .alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function updateData(data) {
    var n = data.nodes;
    var l = data.edges;
    n.forEach(element => {
        if (!nodeExists(element.id)) {
            // console.log("node is not in array");
            nodes.push(element);
        } else {
            // console.log("node is already in array");
        }
    });
    l.forEach(e => {
        if (!linkExists(e.source, e.target, e.edge)) {
            // console.log("link is not in array");
            links.push(e);
        } else {
            // console.log("link is already in array");
        }
    });

}

function linkExists(source, target, link) {
    for (var i = 0; i < links.length; i++) {
        if (links[i].source.id === source
            && links[i].target.id === target
            && links[i].edge === link) {
            return true;
        }
    }
    return false;
}

function nodeExists(id) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return true;
        }
    }
    return false;
}