import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-google-charts";
import { averageNeoDiameter } from "../../helpers/AverageDiameterCalculation";

const BarChartNeos = () => {
  const [neos, setNeos] = useState([]);
  // load time management
  const [isLoading, setIsLoading] = useState(false);
  // error management
  const [error, setError] = useState(null);

  // fetch Neos's data from nasa api
  useEffect(() => {
    const fetchNeos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://www.neowsapp.com/rest/v1/neo/browse?page=0&size=20&api_key=${process.env.REACT_APP_API_KEY_NASA}`
        );
        const data = response.data.near_earth_objects.map((neo) => ({
          name: neo.name,
          estimated_diameter_max:
            neo.estimated_diameter.kilometers.estimated_diameter_max,
          estimated_diameter_min:
            neo.estimated_diameter.kilometers.estimated_diameter_min,
          closeApproaches: neo.close_approach_data.map((approach) => ({
            orbitingBody: approach.orbiting_body,
          })),
        }));
        setIsLoading(false);
        // set new state with data we have just fetched
        setNeos(data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    fetchNeos();
  }, []);

  // sort the data to display Neos according to their average diameter (descending)
  const sorted = neos.sort(
    (a, b) => averageNeoDiameter(b) - averageNeoDiameter(a)
  );

  // format data to match with google chart data structure
  const formatData = [
    ["Name", "Estimated diameter min", "Estimated diameter max"],
    ...sorted.map((neo) => [
      neo.name,
      neo.estimated_diameter_min,
      neo.estimated_diameter_max,
    ]),
  ];

  return (
    <section>
      {/* if the page is loading, display a text that it is loading */}
      {isLoading && <p>Loading…</p>}
      {/* if there is an error, display the arror message  */}
      {error && <p>We encountered an error: {error.message}</p>}
      {/* if the array contains at least one element, display the Chart */}
      {neos.length > 0 && (
        <Chart
          width={"1000px"}
          height={"600px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={formatData}
          options={{
            title:
              "NEOS min and max estimated diameter, sorted by average estimated diameter descending",
            chartArea: { width: "50%" },
            hAxis: {
              title: "min and max estimated diameter",
              minValue: 0,
            },
            vAxis: {
              title: "NEO name",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "1" }}
        />
      )}
    </section>
  );
};

export default BarChartNeos;
