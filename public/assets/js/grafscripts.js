// Pie Chart
var ctx = document.getElementById("byChart").getContext("2d");
var byChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Checkin", "Checkout", "Pending", "Canceled"],
    datasets: [
      {
        backgroundColor: ["#2ecc71", "#3498db", "#95a5a6", "#9b59b6"],
        data: [12, 19, 3, 17],
      },
    ],
  },
});

// Line Chart

$(function () {
  var myChart = $("#linechart").highcharts({
    chart: {},
    xAxis: {
      categories: [
        "Jun-22",
        "jul-22",
        "Aug-22",
        "Sep-22",
        "Oct-22",
        "Nov-22",
        "Dec-22",
        "Jan-22",
        "Feb-22",
        "Mar-22",
        "Apr-22",
        "May-22",
      ],
    },

    plotOptions: {
      line: {
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },

    series: [
      {
        id: "series-1",
        data: [
          29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
          95.6, 54.4,
        ],
      },
    ],
  });

  $("#configButton").click(function () {
    var chart = $("#linechart").highcharts(),
      series = chart.get("series-1");

    series.update({
      lineWidth: 10,
    });
  });
});

// coloum Chart
var ctx = document.getElementById("coloumchart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "jun-22",
      "july-22",
      "Aug-22",
      "Sep-22",
      "Oct-22",
      "Nov-22",
      "Dec-22",
      "Jan-22",
      "Feb-22",
      "Mar-22",
      "Apr-22",
      "May-22",
    ],
    datasets: [
      {
        label: "Booking Confirmed",
        data: [12, 19, 3, 17, 28, 24, 7],
        backgroundColor: "rgba(153,255,51,1)",
      },
      {
        label: "Booking Pending",
        data: [40, 29, 5, 5, 20, 3, 10],
        backgroundColor: "rgba(255,153,0,1)",
      },
    ],
  },
});

var ctx = document.getElementById("coloumchart2").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [
      "jun-22",
      "july-22",
      "Aug-22",
      "Sep-22",
      "Oct-22",
      "Nov-22",
      "Dec-22",
      "Jan-22",
      "Feb-22",
      "Mar-22",
      "Apr-22",
      "May-22",
    ],
    datasets: [
      {
        label: "Total Amount",
        data: [12, 19, 3, 17, 28, 24, 7],
        backgroundColor: "rgba(89, 228, 142, 1)",
      },
      {
        label: "Confirmed Booking ",
        data: [40, 29, 5, 5, 20, 3, 10],
        backgroundColor: "rgba(173, 201, 184, 1)",
      },
    ],
  },
});
