// data
var data // data about the countries
  , countries // lang data
  , data_ // processed data about countries 
  , countries_; // processed data about different names

function avg(country, numberOfMetrics) {
  return (country["housing"]           // 1
        + country["income"]            // 2
        + country["jobs"]              // 3
        + country["community"]         // 4
        + country["education"]         // 5
        + country["environment"]       // 6
        + country["civic engagement"]  // 7
        + country["health"]            // 8
        + country["life satisfaction"] // 9
        + country["safety"]            // 10
        + country["work life balance"] // 11
        )/numberOfMetrics;
}

function processData(numberOfMetrics) {
  data_ = {};
  data.forEach(function(d) {
    data_[d.country] = {};
    
    data_[d.country]["housing"] = +d.housing;                        // 1
    data_[d.country]["income"] = +d.income;                          // 2
    data_[d.country]["jobs"] = +d.jobs;                              // 3
    data_[d.country]["community"] = +d.community;                    // 4
    data_[d.country]["education"] = +d.education;                    // 5
    data_[d.country]["environment"] = +d.environment;                // 6
    data_[d.country]["civic engagement"] = +d["civic engagement"];   // 7
    data_[d.country]["health"] = +d["health"];                       // 8
    data_[d.country]["life satisfaction"] = +d["life satisfaction"]; // 9
    data_[d.country]["safety"] = +d.safety;                          // 10
    data_[d.country]["work life balance"] = +d["work-life balance"]; // 11

    data_[d.country]["avg"] = avg(data_[d.country], numberOfMetrics);
  });

  countries_ = {};
  countries.forEach(function(d) {
    countries_[d.code] = {};
    countries_[d.code]["en"] = d.en;
    countries_[d.code]["fr"] = d.fr;
    countries_[d.code]["es"] = d.es;
    countries_[d.code]["ru"] = d.ru;
    countries_[d.code]["de"] = d.de;
    countries_[d.code]["pt"] = d.pt;
    countries_[d.code]["it"] = d.it;
  });
}
