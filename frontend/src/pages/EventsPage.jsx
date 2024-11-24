import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Route/Events/EventsCard";
import Header from "../components/layouts/Header";
import Loader from "../components/layouts/loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
        </div>
      )}
    </>
  );
};

export default EventsPage;