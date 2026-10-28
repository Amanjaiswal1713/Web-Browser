import {
  ArrowRight,
  Building2,
  Newspaper,
  Rocket,
  Umbrella,
} from "lucide-react";

import { secondaryStories } from "../../data/dashboardData";

const storyIcons = {
  "story-1": Building2,
  "story-2": Rocket,
  "story-3": Umbrella,
};

function TopStories({ styles }) {
  return (
    <section className={`${styles.panel} ${styles.topStories}`}>
      <header className={styles.panelHeader}>
        <div>
          <Newspaper size={19} />

          <h2>Top Stories</h2>
        </div>

        <button type="button">
          View all
          <ArrowRight size={15} />
        </button>
      </header>

      <div className={styles.storiesContent}>
        <article className={styles.featuredStory}>
          <div className={styles.featuredVisual}>
            <span className={styles.cityBuildingOne} />
            <span className={styles.cityBuildingTwo} />
            <span className={styles.cityBuildingThree} />
            <span className={styles.citySun} />
          </div>

          <div className={styles.featuredStoryText}>
            <h3>Tech innovations shaping a smarter future</h3>

            <p>
              Discover how emerging technology is transforming everyday digital
              experiences.
            </p>

            <button type="button">Read more</button>
          </div>
        </article>

        <div className={styles.secondaryStories}>
          {secondaryStories.map((story) => {
            const Icon = storyIcons[story.id] ?? Newspaper;

            return (
              <article key={story.id} className={styles.secondaryStory}>
                <div
                  className={`${styles.storyThumbnail} ${
                    styles[`storyThumbnail${story.color}`]
                  }`}
                >
                  <Icon size={23} />
                </div>

                <div>
                  <h3>{story.title}</h3>
                  <p>{story.time}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TopStories;
