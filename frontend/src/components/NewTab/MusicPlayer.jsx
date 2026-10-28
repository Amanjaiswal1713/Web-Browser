import {
  Heart,
  MoreVertical,
  Music2,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useState } from "react";

function MusicPlayer({ styles }) {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <section className={`${styles.panel} ${styles.musicPlayer}`}>
      <header className={styles.panelHeader}>
        <div>
          <Music2 size={19} />
          <h2>Music Player</h2>
        </div>
      </header>

      <div className={styles.musicContent}>
        <div className={styles.albumCover}>
          <div className={styles.albumSun} />
          <div className={styles.albumMountainOne} />
          <div className={styles.albumMountainTwo} />
        </div>

        <div className={styles.trackArea}>
          <div className={styles.trackHeader}>
            <div>
              <h3>Dreamwave</h3>
              <p>Chill Vibes</p>
            </div>

            <div className={styles.trackActions}>
              <button
                type="button"
                className={liked ? styles.likedButton : ""}
                onClick={() => setLiked(!liked)}
                aria-label={
                  liked ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart size={19} fill={liked ? "currentColor" : "none"} />
              </button>

              <button type="button" aria-label="More options">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className={styles.progressRow}>
            <div className={styles.progressTrack}>
              <span />
            </div>

            <small>01:24 / 03:56</small>
          </div>

          <div className={styles.playerControls}>
            <button type="button">
              <Shuffle size={17} />
            </button>

            <button type="button">
              <SkipBack size={20} />
            </button>

            <button
              type="button"
              className={styles.playButton}
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? "Pause track" : "Play track"}
            >
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>

            <button type="button">
              <SkipForward size={20} />
            </button>

            <button type="button">
              <Repeat2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MusicPlayer;
