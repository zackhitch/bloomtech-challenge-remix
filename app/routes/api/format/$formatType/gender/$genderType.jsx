import { json } from "remix";

import axios from "axios";

export const loader = async ({ params }) => {
  // handle "GET" request
  const res = await axios.get(
    `https://randomuser.me/api/?format=json&results=50&exc=email,login,registered,phone,cell,picture,id`
  );

  let data = null;
  let genderInPopulation = null;
  let genderData = null;
  if (params.formatType === "json") {
    data = res.data.results;
    genderInPopulation = data.filter(
      (user) => user.gender === params.genderType
    );
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
  console.log(params);
};
