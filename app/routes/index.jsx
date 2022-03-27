import { json, useLoaderData, Link, useCatch } from "remix";

import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const loader = async () => {
  const res = await axios.get(
    "https://randomuser.me/api/?results=5000&exc=email,login,registered,phone,cell,picture,id"
  );
  // console.log(res);
  const data = res.data.results;

  let totalPopulation = 0;
  let numberOfFemales = 0;
  let percentFemale = 0;
  let numberOfMales = 0;
  let percentMale = 0;
  let populationByCountry = {};
  let populationByUsStates = {};
  let populationByAgeGroup = {
    "Under 16": 0,
    "16-25": 0,
    "26-45": 0,
    "46-65": 0,
    "66-85": 0,
    "Over 85": 0,
  };
  let percentByAgeGroup = {
    "Under 16": 0,
    "16-25": 0,
    "26-45": 0,
    "46-65": 0,
    "66-85": 0,
    "Over 85": 0,
  };
  for (let i = 0; i < data.length; i++) {
    if (data[i].gender === "female") {
      numberOfFemales++;
    }
    if (data[i].gender === "male") {
      numberOfMales++;
    }
    typeof populationByCountry[data[i].location.country] === "undefined"
      ? (populationByCountry[data[i].location.country] = 1)
      : populationByCountry[data[i].location.country]++;

    if (data[i].location.country === "United States") {
      typeof populationByUsStates[data[i].location.state] === "undefined"
        ? (populationByUsStates[data[i].location.state] = 1)
        : populationByUsStates[data[i].location.state]++;
    }

    let userAge = data[i].dob.age;
    if (userAge < 16) {
      populationByAgeGroup["Under 16"]++;
    }
    if (userAge >= 16 && userAge <= 25) {
      populationByAgeGroup["16-25"]++;
    }
    if (userAge >= 26 && userAge <= 45) {
      populationByAgeGroup["26-45"]++;
    }
    if (userAge >= 46 && userAge <= 65) {
      populationByAgeGroup["46-65"]++;
    }
    if (userAge >= 66 && userAge <= 85) {
      populationByAgeGroup["66-85"]++;
    }
    if (userAge > 85) {
      populationByAgeGroup["Over 85"]++;
    }
  }
  totalPopulation = data.length;

  percentFemale = numberOfFemales / data.length;
  percentMale = numberOfMales / data.length;

  for (const key in populationByAgeGroup) {
    if (populationByAgeGroup.hasOwnProperty(key)) {
      percentByAgeGroup[key] = populationByAgeGroup[key] / data.length;
    }
  }

  const topMostPopulatedCountries = Object.fromEntries(
    Object.entries(populationByCountry).sort(([, a], [, b]) => b - a)
  );
  const topCountriesArray = Object.entries(populationByCountry).sort(
    ([, a], [, b]) => b - a
  );
  console.log(topCountriesArray);
  let totalPopOfTop5Countries = 0;
  let top5PopulousCountries = [];
  for (let j = 0; j < 5; j++) {
    totalPopOfTop5Countries += topCountriesArray[j][1];
    top5PopulousCountries.push(topCountriesArray[j][0]);
  }

  const topMostPopulatedUsStates = Object.fromEntries(
    Object.entries(populationByUsStates).sort(([, a], [, b]) => b - a)
  );
  const topUsStatesArray = Object.entries(populationByUsStates).sort(
    ([, a], [, b]) => b - a
  );
  let totalPopOfTop5UsStates = 0;
  let top5PopulousUsStates = [];
  for (let k = 0; k < 5; k++) {
    totalPopOfTop5UsStates += topUsStatesArray[k][1];
    top5PopulousUsStates.push(topUsStatesArray[k][0]);
  }

  let femalesInTop5Countries = 0;
  let malesInTop5Countries = 0;
  for (let l = 0; l < data.length; l++) {
    if (
      top5PopulousCountries.includes(data[l].location.country) &&
      data[l].gender === "female"
    ) {
      femalesInTop5Countries++;
    } else if (
      top5PopulousCountries.includes(data[l].location.country) &&
      data[l].gender === "male"
    ) {
      malesInTop5Countries++;
    }
  }
  let percentFemalesInTop5Countries =
    femalesInTop5Countries / totalPopOfTop5Countries;
  let percentMalesInTop5Countries =
    malesInTop5Countries / totalPopOfTop5Countries;

  let femalesInTop5UsStates = 0;
  let malesInTop5UsStates = 0;
  for (let m = 0; m < data.length; m++) {
    if (
      data[m].location.country === "United States" &&
      top5PopulousUsStates.includes(data[m].location.state) &&
      data[m].gender === "female"
    ) {
      femalesInTop5UsStates++;
    } else if (
      data[m].location.country === "United States" &&
      top5PopulousUsStates.includes(data[m].location.state) &&
      data[m].gender === "male"
    ) {
      malesInTop5UsStates++;
    }
  }
  let percentFemalesInTop5UsStates =
    femalesInTop5UsStates / totalPopOfTop5UsStates;
  let percentMalesInTop5UsStates = malesInTop5UsStates / totalPopOfTop5UsStates;

  const usefulData = [
    { id: 1, percentFemaleInTotalPopulation: percentFemale },
    { id: 2, percentFemaleInTop5Countries: percentFemalesInTop5Countries },
    { id: 3, percentFemaleInTop5UsStates: percentFemalesInTop5UsStates },
    { id: 4, percentInTotalPopulationByAgeGroup: percentByAgeGroup },
    { id: 6, percentMaleInTotalPopulation: percentMale },
    { id: 5, totalPopulation: totalPopulation },
    { id: 7, percentMaleInTop5Countries: percentMalesInTop5Countries },
    { id: 8, percentMaleInTop5UsStates: percentMalesInTop5UsStates },
  ];

  return json(usefulData);
};

export default function UserDataIndexRoute() {
  const data = useLoaderData();

  const totalPopChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Population Demographics",
      },
    },
  };

  const totalPopChartData = {
    labels: ["Total Population"],
    datasets: [
      {
        label: "Total Population",
        data: [data[5].totalPopulation],
        backgroundColor: ["rgba(6, 6, 252, 0.284)"],
        borderColor: ["#3d33fe"],
        borderWidth: 1,
      },
    ],
  };

  const percentagesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Gender Demographics",
      },
    },
  };

  const percentagesLabels = [
    "% of Total Population",
    "% of Top 5 Countries",
    "% of Top 5 US States",
  ];

  const femalePercents = [
    (data[0].percentFemaleInTotalPopulation * 100).toFixed(2),
    (data[1].percentFemaleInTop5Countries * 100).toFixed(2),
    (data[2].percentFemaleInTop5UsStates * 100).toFixed(2),
  ];

  const malePercents = [
    (data[4].percentMaleInTotalPopulation * 100).toFixed(2),
    (data[6].percentMaleInTop5Countries * 100).toFixed(2),
    (data[7].percentMaleInTop5UsStates * 100).toFixed(2),
  ];

  const percentageChartData = {
    labels: percentagesLabels,
    datasets: [
      {
        label: "Females",
        data: femalePercents,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Males",
        data: malePercents,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const percentagesAgeGroupChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Age Demographics",
      },
    },
  };

  const percentagesAgeGroupLabels = [
    "Under 16",
    "16-25",
    "26-45",
    "46-65",
    "66-85",
    "Over 85",
  ];

  const percentageAgeGroupChartData = {
    labels: percentagesAgeGroupLabels,
    datasets: [
      {
        label: "Age Group % in Population",
        data: Object.keys(data[3].percentInTotalPopulationByAgeGroup).map((k) =>
          (data[3].percentInTotalPopulationByAgeGroup[k] * 100).toFixed(2)
        ),
        backgroundColor: "rgba(50, 199, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="mainContainer">
      <h1>Random User API Data Insight</h1>
      <div className="totalPop chart">
        <Doughnut options={totalPopChartOptions} data={totalPopChartData} />
      </div>
      <div className="percentData chart">
        <Bar options={percentagesChartOptions} data={percentageChartData} />
      </div>
      <div className="percentData chart">
        <Bar
          options={percentagesAgeGroupChartOptions}
          data={percentageAgeGroupChartData}
        />
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no users to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
