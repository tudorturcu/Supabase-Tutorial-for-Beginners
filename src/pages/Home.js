import { useEffect, useState } from "react";

import supabase from "../config/supabaseClient";
// components
import SmoothieCard from "../components/SmoothieCard";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");

  const handleDelete = (id) => {
    // will use an updater function (passing a function instead of a value inside setState function): https://react.dev/learn/queueing-a-series-of-state-updates
    setSmoothies((prevSmoothies) => {
      return prevSmoothies.filter((sm) => sm.id !== id);
    });
  };

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from("smoothies")
        .select()
        .order(orderBy, { ascending: false });

      if (error) {
        setFetchError("Could not fetch the smoothies");
        setSmoothies(null);
        console.log(error);
      }

      if (data) {
        setSmoothies(data);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, [orderBy]);

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {smoothies && (
        <div className="smoothies">
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <button onClick={() => setOrderBy("title")}>Title</button>
            <button onClick={() => setOrderBy("rating")}>Rating</button>
            {orderBy}
          </div>
          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
