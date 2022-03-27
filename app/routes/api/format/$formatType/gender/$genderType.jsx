import { json } from "remix";

import axios from "axios";

export const loader = async ({ params }) => {
  // handle "GET" request
  const res = await axios.get(
    `https://randomuser.me/api/?format=${params.formatType}&results=50&exc=email,login,registered,phone,cell,picture,id`
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
    data = res;
    genderInPopulation = data;
    genderData = genderInPopulation;
    return new Response(genderData.data);
  }
  console.log(params);
};
