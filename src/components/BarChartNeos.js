import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-google-charts";

const BarChartNeos = () => {
  const [neos, setNeos] = useState([]);

  // fetch Neos's data from nasa api
  useEffect(() => {
    const fetchNeos = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${process.env.REACT_APP_API_KEY_NASA}`
        );
        const data = response.data.near_earth_objects.map((neo) => ({
          name: neo.name,
          estimated_diameter_max:
            neo.estimated_diameter.kilometers.estimated_diameter_max,
          estimated_diameter_min:
            neo.estimated_diameter.kilometers.estimated_diameter_min,
        }));
        setNeos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNeos();
  }, []);

  return (
    <div>
      {neos.length > 0 && (
        <Chart
          width={"1000px"}
          height={"600px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Name", "estimated diameter max", "estimated diameter min"],
            [
              neos[0].name,
              neos[0].estimated_diameter_max,
              neos[0].estimated_diameter_min,
            ],
          ]}
          options={{
            title:
              "min and max estimated diameter, sorted by average estimated diameter descending",
            chartArea: { width: "50%" },
            hAxis: {
              itle: "min and max estimated diameter",
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
    </div>
  );
};

export default BarChartNeos;
