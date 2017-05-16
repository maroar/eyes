// function tooltip() {


//     $("*[rel=tooltip]").hover(function (e) {

//         var titulo = $(this).attr('title');
//         $(this).attr('title', '');

//         $("body").append('<div class="tooltip">' + titulo + '</div>');

//         $('.tooltip').css({
//             top: e.pageY - 50,
//             left: e.pageX + 20
//         }).fadeIn();

//     }, function () {
//         $(this).attr('title', $('.tooltip').html());
//         $('.tooltip').remove();

//     }).mousemove(function (e) {
//         $('.tooltip').css({
//             top: e.pageY - 50,
//             left: e.pageX + 20
//         })
//     })




// }


function tooltip() {
  $("*[rel=tooltip]").on("mouseover", function(e) {
    var titulo = $(this).attr('title');
    div = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .text(titulo)
      .style("left", (e.pageX + 20) + "px")
      .style("top", (e.pageY - 0) + "px")
      .style("opacity", 1)
      .style("display","block");
  }).on("mouseout", function(e){
    div.html("").style("display","none");
  });
}