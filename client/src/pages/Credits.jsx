import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, token } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans.");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { headers: { Authorization: token } }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-10 xl:mt-30 text-cyan-800 dark:text-cyan-100">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border border-cyan-300/50 dark:border-cyan-700 rounded-lg shadow hover:shadow-lg 
  transition-all duration-200 p-6 min-w-[300px] flex flex-col hover:border-cyan-400/70 dark:hover:border-cyan-500 ${
    plan._id === "pro"
      ? "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/20"
      : " dark:bg-gradient-to-br dark:from-cyan-900/10 dark:to-teal-900/10"
  }`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">
                ${plan.price}{" "}
                <span className="text-base font-normal text-cyan-700/80 dark:text-cyan-300/80">
                  {" "}
                  / {plan.credits} credits
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-cyan-800 dark:text-cyan-300 space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() =>
                toast.promise(purchasePlan(plan._id), {
                  loading: "Processing...",
                })
              }
              className="mt-6 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 active:from-cyan-700 active:to-teal-800 text-white font-medium py-2 rounded transition-all duration-200 cursor-pointer shadow-sm shadow-cyan-500/20"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
