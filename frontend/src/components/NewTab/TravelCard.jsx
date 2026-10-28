import { ArrowRight, Image } from "lucide-react";

function TravelCard({ styles }) {
  return (
    <section className={`${styles.panel} ${styles.travelCard}`}>
      <header className={styles.panelHeader}>
        <div>
          <Image size={19} />
          <h2>Your Travel Inspiration</h2>
        </div>

        <span className={styles.carouselDots}>
          <i className={styles.activeDot} />
          <i />
          <i />
          <i />
        </span>
      </header>

      <div className={styles.travelVisual}>
        <div className={styles.travelSun} />
        <div className={styles.travelMountainBack} />
        <div className={styles.travelMountainFront} />
        <div className={styles.travelLake} />

        <div className={styles.travelText}>
          <h3>
            Explore
            <br />
            the Extraordinary
          </h3>

          <p>Breathtaking places. Unforgettable journeys.</p>
        </div>

        <button type="button">
          Explore now
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

export default TravelCard;
