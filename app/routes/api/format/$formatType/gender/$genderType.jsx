import { json } from "remix";

import axios from "axios";

export const loader = async ({ params }) => {
  // handle "GET" request
  const res = await axios.get(
    "https://randomuser.me/api/?results=5000&exc=email,login,registered,phone,cell,picture,id"
  );
  // console.log(res);
  const data = res.data.results;

  console.log(params);

  const genderInPopulation = data.filter(
    (user) => user.gender === params.genderType
  );
  const genderData = genderInPopulation;

  return json(genderData, { success: true }, 200);
};
