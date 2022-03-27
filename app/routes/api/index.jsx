import { json } from "remix";

import axios from "axios";

export const loader = async ({ request }) => {
  // handle "GET" request
  const res = await axios.get(
    "https://randomuser.me/api/?results=5000&exc=email,login,registered,phone,cell,picture,id"
  );
  // console.log(res);
  const data = res.data.results;

  return json(data, { success: true }, 200);
};
