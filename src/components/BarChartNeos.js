import { useEffect, useState } from "react";
import axios from "axios";

const BarChartNeos = () => {
  const [neos, setNeos] = useState([]);

  // fetch Neos's data from nasa api
  useEffect(() => {
    const fetchNeos = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY"
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
      <p>
        {neos[0].name}
        {neos[0].estimated_diameter_max}
      </p>
      <p>
        {neos[1].name}
        {neos[0].estimated_diameter_min}
      </p>
    </div>
  );
};

export default BarChartNeos;
