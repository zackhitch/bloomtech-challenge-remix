import { json } from "remix";

import axios from "axios";

export const loader = async ({ params }) => {
  // handle "GET" request
  const res = await axios.get(
    `https://randomuser.me/api/?format=json&results=100&exc=email,login,registered,phone,cell,picture,id`
  );

  let data = null;
  let genderInPopulation = null;
  let genderData = null;
  let populationByCountry = {};
  let populationByUsStates = {};

  if (params.formatType === "json") {
    data = res.data.results;
    genderInPopulation = data.filter(
      (user) => user.gender === params.genderType
    );
    if (params.location === "country") {
      for (let i = 0; i < genderInPopulation.length; i++) {
        typeof populationByCountry[genderInPopulation[i].location.country] ===
        "undefined"
          ? (populationByCountry[genderInPopulation[i].location.country] = 1)
          : populationByCountry[genderInPopulation[i].location.country]++;
      }

      let topCountriesArray = Object.entries(populationByCountry).sort(
        ([, a], [, b]) => b - a
      );
      let top5CountriesArray = [];
      topCountriesArray.forEach((element) =>
        top5CountriesArray.push(element[0])
      );
      top5CountriesArray = top5CountriesArray.slice(0, 5);

      genderInPopulation = genderInPopulation.filter((user) =>
        top5CountriesArray.includes(user.location.country)
      );
    } else if (params.location === "us") {
      for (let j = 0; j < genderInPopulation.length; j++) {
        if (data[j].location.country === "United States") {
          typeof populationByUsStates[data[j].location.state] === "undefined"
            ? (populationByUsStates[data[j].location.state] = 1)
            : populationByUsStates[data[j].location.state]++;
        }
      }

      let topUsStatesArray = Object.entries(populationByUsStates).sort(
        ([, a], [, b]) => b - a
      );
      let top5UsStatesArray = [];
      topUsStatesArray.forEach((element) => top5UsStatesArray.push(element[0]));
      top5UsStatesArray = top5UsStatesArray.slice(0, 5);

      genderInPopulation = genderInPopulation.filter((user) =>
        top5UsStatesArray.includes(user.location.state)
      );
    }
    genderData = genderInPopulation;
    return json(genderData, { success: true }, 200);
  } else if (params.formatType === "csv") {
    data = res.data.results;
    genderInPopulation = data.filter(
      (user) => user.gender === params.genderType
    );
    genderData = genderInPopulation;
    const replacer = (key, value) => (value === null ? "" : value); // specify how to handle null values
    const header = Object.keys(genderData[0]);
    const csv = [
      header.join(","), // header row first
      ...genderData.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");
    return new Response(csv);
  }
};
